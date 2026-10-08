import { create } from 'zustand'

type AuthStore = {
  accessToken: string;
  idToken: string;
  username: string;
  isAuthLoading: boolean;
  setAccessToken: (accessToken: string) => void;
  setUsername: (username: string) => void;
  setIdToken: (idToken: string) => void;
  setIsAuthLoading: (isAuthLoading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  accessToken: '',
  idToken: '',
  username: '',
  isAuthLoading: true,
  setAccessToken: (accessToken: string) => set({ accessToken }),
  setUsername: (username: string) => set({ username }),
  setIdToken: (idToken: string) => set({ idToken }),
  setIsAuthLoading: (isAuthLoading: boolean) => set({ isAuthLoading }),
}));

// zustand my GOAT