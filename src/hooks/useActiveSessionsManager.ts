import { useCallback, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import { useCustomerStore } from '../stores/CustomerStore';
import { useSettingsStore } from '../stores/SettingsStore';

/**
 * Hook responsible for managing the active sessions background engine.
 * Decouples the global ticking and screen-focus data loading from the UI layer.
 */
export function useActiveSessionsManager() {
  const { activeSessions, isLoading, loadActiveSessions, tickTimers } = useCustomerStore();
  const { settings, loadSettings } = useSettingsStore();

  // Load data immediately on screen focus to prevent stale data
  useFocusEffect(
    useCallback(() => {
      loadActiveSessions();
      if (!settings) {
        loadSettings();
      }
    }, [loadActiveSessions, loadSettings, settings])
  );

  // Background engine for checking DB thresholds and firing notifications
  useEffect(() => {
    // Tick every 5 seconds to minimize CPU usage while keeping background accurate
    const interval = setInterval(() => {
      const warningMinutes = settings?.warning_minutes || 5;
      tickTimers(warningMinutes);
    }, 5000);

    return () => clearInterval(interval);
  }, [tickTimers, settings]);

  return { activeSessions, isLoading, settings };
}
