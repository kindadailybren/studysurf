import { create } from 'zustand'

type AuthStore = {
  accessToken: string;
  idToken: string;
  username: string;
  expiration: number;
  setAccessToken: (accessToken: string) => void;
  setUsername: (username: string) => void;
  setIdToken: (idToken: string) => void;
  setExpiration: (expiration: number) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: '',
  idToken: '',
  username: '',
  expiration: 0,
  setAccessToken: (accessToken) => set({accessToken}),
  setUsername: (username) => set({username}),
  setIdToken: (idToken) => set({idToken}),
  setExpiration: (expiration) => set({expiration}),
}));

// zustand my GOAT