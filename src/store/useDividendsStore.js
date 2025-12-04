import { create } from 'zustand';

export const useDividendsStore = create((set) => ({
  fileData: null,
  fileMetadata: null,
  setFileData: (data, metadata) =>
    set({ fileData: data, fileMetadata: metadata }),
  clearFileData: () => set({ fileData: null, fileMetadata: null }),
}));
