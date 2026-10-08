import { create } from 'zustand'

type LoginModalStore = {
  isOpenSignIn: boolean;
  isOpenSignUp: boolean;
  isOpenAccConfirm: boolean;
  isOpenForgotPass: boolean;
  isOpenForgotPassUsername: boolean;
  usernameInput: string;
  setIsOpenSignIn: (accessToken: boolean) => void;
  setIsOpenSignUp: (username: boolean) => void;
  setIsOpenAccConfirm: (idToken: boolean) => void;
  setIsOpenForgotPass: (idToken: boolean) => void;
  setIsOpenForgotPassUsername: (idToken: boolean) => void;
  setUsernameInput: (idToken: string) => void;
}

export const useLoginModalStore = create<LoginModalStore>()((set) => ({
  isOpenSignIn: false,
  isOpenSignUp: false,
  isOpenAccConfirm: false,
  isOpenForgotPass: false,
  isOpenForgotPassUsername: false,
  usernameInput: '',
  setIsOpenSignIn: (isOpenSignIn: boolean) => set({ isOpenSignIn }),
  setIsOpenSignUp: (isOpenSignUp: boolean) => set({ isOpenSignUp }),
  setIsOpenAccConfirm: (isOpenAccConfirm: boolean) => set({ isOpenAccConfirm }),
  setIsOpenForgotPass: (isOpenForgotPass: boolean) => set({ isOpenForgotPass }),
  setIsOpenForgotPassUsername: (isOpenForgotPassUsername: boolean) =>
    set({ isOpenForgotPassUsername }),
  setUsernameInput: (usernameInput: string) => set({ usernameInput }),
}));