import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (payload: { user: User; token: string }) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
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
