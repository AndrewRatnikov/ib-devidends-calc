import { create } from 'zustand';

export const useDividendsStore = create((set) => ({
  fileData: null,
  setFileData: (data) => set({ fileData: data }),
  clearFileData: () => set({ fileData: null }),
}));
