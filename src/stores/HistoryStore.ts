import { create } from 'zustand';
import { HistoryRepository } from '../database/repositories/HistoryRepository';
import { History } from '../models/types';

interface HistoryState {
  history: History[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loadHistory: () => Promise<void>;
  searchHistory: (query: string) => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    if (query.trim().length === 0) {
      get().loadHistory();
    } else {
      get().searchHistory(query);
    }
  },
  loadHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await HistoryRepository.getAllHistory(100, 0); // Load last 100 for brevity
      set({ history: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  searchHistory: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await HistoryRepository.searchHistory(query);
      set({ history: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
