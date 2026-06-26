import { useState, useEffect } from 'react';
import { TimerEngine } from '../timer/TimerEngine';

/**
 * Local hook to handle visual ticking of a session timer.
 * This completely removes the need for a global 1-second state update loop.
 */
export function useSessionTimer(
  startTimestamp: number,
  endTimestamp: number | null,
  isOpenSession: boolean,
  warningMinutes: number
) {
  const [timerDisplay, setTimerDisplay] = useState('--:--');

  useEffect(() => {
    // Initial calculation
    const initialState = TimerEngine.calculateState(startTimestamp, endTimestamp, isOpenSession, warningMinutes);
    setTimerDisplay(initialState.displayString);

    if (initialState.isExpired && !isOpenSession) {
       // If it's already expired, no need to keep ticking.
       return;
    }

    const interval = setInterval(() => {
      const state = TimerEngine.calculateState(startTimestamp, endTimestamp, isOpenSession, warningMinutes);
      setTimerDisplay(state.displayString);
      
      if (state.isExpired && !isOpenSession) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTimestamp, endTimestamp, isOpenSession, warningMinutes]);

  return timerDisplay;
}
