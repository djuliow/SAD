import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: ({ user, token }) => set({ user, token }),
      signOut: () => set({ user: null, token: null })
    }),
    { name: "sentosa-auth" }
  )
);
