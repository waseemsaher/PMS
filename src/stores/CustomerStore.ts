import { create } from 'zustand';
import { SessionRepository } from '../database/repositories/SessionRepository';
import { Session } from '../models/types';
import { TimerEngine } from '../timer/TimerEngine';
import { NotificationService } from '../notifications/NotificationService';

import { SessionRental } from '../models/types';

interface ActiveSession extends Session {
  customer_name: string;
  people_count: number;
  rentals?: (SessionRental & { name: string })[];
}

export interface ComputedActiveSession extends ActiveSession {
  isWarning: boolean;
  isExpired: boolean;
}

interface CustomerState {
  activeSessions: ComputedActiveSession[];
  isLoading: boolean;
  error: string | null;
  loadActiveSessions: () => Promise<void>;
  tickTimers: (warningMinutes: number) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  activeSessions: [],
  isLoading: false,
  error: null,
  loadActiveSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const sessions = await SessionRepository.getActiveSessions();
      
      const computedSessions = await Promise.all(sessions.map(async (s) => {
        // Fetch rentals for each session
        const { RentalRepository } = require('../database/repositories/RentalRepository');
        const rentals = await RentalRepository.getRentalsForSession(s.id);
        
        return {
          ...s,
          rentals,
          isWarning: false,
          isExpired: false,
        };
      }));

      // Fire and forget notifications
      NotificationService.processSessionNotifications(computedSessions).catch(console.error);

      // Sync Dashboard automatically
      const { useDashboardStore } = require('./DashboardStore');
      useDashboardStore.getState().loadDashboard();

      set({ activeSessions: computedSessions, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  tickTimers: (warningMinutes: number) => {
    set((state) => {
      let hasChanges = false;
      
      const computedSessions = state.activeSessions.map((session) => {
        const timerState = TimerEngine.calculateState(
          session.start_timestamp,
          session.end_timestamp,
          session.is_open_session,
          warningMinutes
        );
        
        let changed = false;

        // Optimistically update DB status if it transitioned to warning or expired
        if (session.status !== timerState.status) {
           SessionRepository.updateSessionStatus(session.id, timerState.status).catch(console.error);
           session.status = timerState.status; // Update local immediately
           changed = true;
        }

        if (session.isWarning !== timerState.isWarning || session.isExpired !== timerState.isExpired) {
           changed = true;
        }

        if (changed) {
          hasChanges = true;
          return {
            ...session,
            isWarning: timerState.isWarning,
            isExpired: timerState.isExpired,
          };
        }

        return session;
      });

      // Fire grouped notifications!
      NotificationService.processSessionNotifications(computedSessions).catch(console.error);

      // If nothing changed status-wise, return the exact same state array reference!
      // This completely blocks Zustand from triggering React re-renders.
      if (hasChanges) {
        return { activeSessions: computedSessions };
      }
      return state;
    });
  },
}));
