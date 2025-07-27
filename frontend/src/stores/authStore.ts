import { create } from 'zustand'

type AuthStore = {
  accessToken: string;
  idToken: string;
  username: string;
  setAccessToken: (accessToken: string) => void;
  setUsername: (username: string) => void;
  setIdToken: (idToken: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: '',
  idToken: '',
  username: '',
  setAccessToken: (accessToken) => set({accessToken}),
  setUsername: (username) => set({username}),
  setIdToken: (idToken) => set({idToken}),
}));

// zustand my GOAT