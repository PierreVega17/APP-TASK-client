import { create } from 'zustand';

export const useBoardStore = create((set) => ({
  boards: [],
  setBoards: (boards) => set({ boards }),
  addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
}));
