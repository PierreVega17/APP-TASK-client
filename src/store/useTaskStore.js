import { create } from 'zustand';

export const useTaskStore = create((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (updatedTask) => set((state) => ({
    tasks: state.tasks.map((task) => task._id === updatedTask._id ? updatedTask : task)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task._id !== id)
  })),
}));
