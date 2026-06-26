import { useCallback } from 'react';
import { SessionService } from '../services/SessionService';
import { useCustomerStore } from '../stores/CustomerStore';
import { PaymentStatus } from '../models/types';

/**
 * Hook responsible for orchestrating database mutations.
 * Abstracting this from the UI keeps the components clean and isolates business logic.
 */
export function useSessionMutations() {
  const loadActiveSessions = useCustomerStore(state => state.loadActiveSessions);

  const createCustomerSession = useCallback(async (data: {
    fullName: string;
    peopleCount: number;
    notes?: string | null;
    sessionType: 'HALF_HOUR' | 'ONE_HOUR' | 'CUSTOM' | 'OPEN';
    customMinutes?: number;
    paymentStatus: PaymentStatus;
    calculatedTotal: number;
    finalAmountPaid: number;
  }) => {
    await SessionService.createCustomerSession(data);
    await loadActiveSessions();
  }, [loadActiveSessions]);

  const finishSession = useCallback(async (sessionId: number) => {
    await SessionService.finishSession(sessionId);
    await loadActiveSessions();
  }, [loadActiveSessions]);

  const extendSession = useCallback(async (sessionId: number, additionalMinutes: number) => {
    await SessionService.extendSession(sessionId, additionalMinutes);
    await loadActiveSessions();
  }, [loadActiveSessions]);

  const addExtras = useCallback(async (
    sessionId: number,
    items: { id: number; quantity: number; price: number }[],
    paymentStatus: PaymentStatus,
    amountPaid: number
  ) => {
    await SessionService.addRentalsToSession(sessionId, items, paymentStatus, amountPaid);
    await loadActiveSessions();
  }, [loadActiveSessions]);

  return {
    createCustomerSession,
    finishSession,
    extendSession,
    addExtras
  };
}
