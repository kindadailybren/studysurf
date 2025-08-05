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

export const useLoginModalStore = create<LoginModalStore>((set) => ({
  isOpenSignIn: false,
  isOpenSignUp: false,
  isOpenAccConfirm: false,
  isOpenForgotPass: false,
  isOpenForgotPassUsername: false,
  usernameInput: '',
  setIsOpenSignIn: (isOpenSignIn) => set({isOpenSignIn}),
  setIsOpenSignUp: (isOpenSignUp) => set({isOpenSignUp}),
  setIsOpenAccConfirm: (isOpenAccConfirm) => set({isOpenAccConfirm}),
  setIsOpenForgotPass: (isOpenForgotPass) => set({isOpenForgotPass}),
  setIsOpenForgotPassUsername: (isOpenForgotPassUsername) => set({isOpenForgotPassUsername}),
  setUsernameInput: (usernameInput) => set({usernameInput}),
}));