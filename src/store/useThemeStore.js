import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  mode: 'light',
  setMode: (mode) => set({ mode }),
  toggleMode: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' }))
}));
