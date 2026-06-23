import { create } from 'zustand';
import { DashboardRepository } from '../database/repositories/DashboardRepository';
import { DashboardCache } from '../models/types';

interface DashboardState {
  dashboard: DashboardCache | null;
  isLoading: boolean;
  error: string | null;
  loadDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dashboard: null,
  isLoading: false,
  error: null,
  loadDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await DashboardRepository.getDashboard();
      set({ dashboard: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
