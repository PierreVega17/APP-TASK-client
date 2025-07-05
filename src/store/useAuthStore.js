import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null,
  setUser: (user) => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
    set({ user });
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  }
}));
