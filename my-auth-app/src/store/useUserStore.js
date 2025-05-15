import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      role:null,
      setUser: (userData) => set({ user: userData, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      setRole : (role) => set({role:role})
    }),
    {
      name: 'user-storage', // key in localStorage
    }
  )
);
 export default useUserStore;