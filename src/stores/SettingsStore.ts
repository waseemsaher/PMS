import { create } from 'zustand';
import { Settings } from '../models/types';
import { SettingsRepository } from '../database/repositories/SettingsRepository';

interface SettingsState {
  settings: Settings | null;
  isLoading: boolean;
  error: string | null;
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const DEFAULT_SETTINGS: Partial<Settings> = {
  hour_price: 100,
  half_hour_price: 50,
  warning_minutes: 5,
  sound_enabled: true,
  vibration_enabled: true,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  isLoading: false,
  error: null,
  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await SettingsRepository.getSettings();
      set({ settings: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  updateSettings: async (updates: Partial<Settings>) => {
    set({ isLoading: true, error: null });
    try {
      await SettingsRepository.updateSettings(updates);
      const updated = await SettingsRepository.getSettings();
      set({ settings: updated, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  resetToDefaults: async () => {
    set({ isLoading: true, error: null });
    try {
      await SettingsRepository.updateSettings(DEFAULT_SETTINGS);
      const updated = await SettingsRepository.getSettings();
      set({ settings: updated, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
