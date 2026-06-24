import { create } from 'zustand';
import { DashboardRepository, DashboardMetrics } from '../database/repositories/DashboardRepository';

interface DashboardState {
  dashboard: DashboardMetrics | null;
  isLoading: boolean;
  error: string | null;
  loadDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dashboard: null,
  isLoading: true,
  error: null,
  loadDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const dashboard = await DashboardRepository.getDashboard();
      set({ dashboard, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
