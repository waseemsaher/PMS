import { create } from 'zustand';
import { SessionRepository } from '../database/repositories/SessionRepository';
import { Session } from '../models/types';
import { TimerEngine } from '../timer/TimerEngine';
import { NotificationService } from '../notifications/NotificationService';

interface ActiveSession extends Session {
  customer_name: string;
  people_count: number;
}

export interface ComputedActiveSession extends ActiveSession {
  timerDisplay: string;
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
      // Initialize computed fields
      const computedSessions = sessions.map(s => ({
        ...s,
        timerDisplay: '--:--',
        isWarning: false,
        isExpired: false,
      }));

      // Fire and forget notifications
      NotificationService.processSessionNotifications(computedSessions).catch(console.error);

      set({ activeSessions: computedSessions, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  tickTimers: (warningMinutes: number) => {
    set((state) => {
      const computedSessions = state.activeSessions.map((session) => {
        const timerState = TimerEngine.calculateState(
          session.start_timestamp,
          session.end_timestamp,
          session.is_open_session,
          warningMinutes
        );
        
        // Optimistically update DB status if it transitioned to warning or expired
        if (session.status !== timerState.status) {
           SessionRepository.updateSessionStatus(session.id, timerState.status).catch(console.error);
           session.status = timerState.status; // Update local immediately
        }

        return {
          ...session,
          timerDisplay: timerState.displayString,
          isWarning: timerState.isWarning,
          isExpired: timerState.isExpired,
        };
      });

      // Fire grouped notifications!
      NotificationService.processSessionNotifications(computedSessions).catch(console.error);

      return { activeSessions: computedSessions };
    });
  },
}));
