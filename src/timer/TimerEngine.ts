import dayjs from 'dayjs';
import { SessionStatus } from '../models/types';

export interface TimerState {
  displayString: string;
  status: SessionStatus;
  isWarning: boolean;
  isExpired: boolean;
}

export class TimerEngine {
  /**
   * Calculates the exact state of a timer based on current timestamp.
   * Absolutely immune to app closures since it strictly relies on Unix timestamps.
   */
  static calculateState(
    startTimestamp: number,
    endTimestamp: number | null,
    isOpenSession: boolean,
    warningMinutes: number
  ): TimerState {
    const current = dayjs().unix();

    if (isOpenSession || !endTimestamp) {
      // Open session counts up from start
      const diffSeconds = current - startTimestamp;
      return {
        displayString: this.formatSeconds(diffSeconds, true),
        status: 'ACTIVE',
        isWarning: false,
        isExpired: false,
      };
    }

    // Fixed duration session counts down to end
    const remainingSeconds = endTimestamp - current;

    if (remainingSeconds <= 0) {
      // Expired: Clamp at 00:00:00
      return {
        displayString: `00:00:00`,
        status: 'EXPIRED',
        isWarning: false,
        isExpired: true,
      };
    }

    // Warning state
    const isWarning = remainingSeconds <= warningMinutes * 60;
    
    return {
      displayString: this.formatSeconds(remainingSeconds, false),
      status: isWarning ? 'WARNING' : 'ACTIVE',
      isWarning,
      isExpired: false,
    };
  }

  private static formatSeconds(totalSeconds: number, includeHoursIfZero: boolean): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    if (hours > 0 || includeHoursIfZero) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    
    return `${pad(minutes)}:${pad(seconds)}`;
  }
}
