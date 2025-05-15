// useVideoStore.js
import { create } from 'zustand';

const useVideoStore = create((set) => ({
  videoId: null,
  setVideoId: (id) => set({ videoId: id }),
}));

export default useVideoStore;
