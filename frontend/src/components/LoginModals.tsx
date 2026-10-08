import React from "react";
import { useLoginModalStore } from "../stores/loginModalStore";
import { SignUpModal } from "./loginModals/SignUpModal";
import { SignInModal } from "./loginModals/SignInModal";
import { AccConfirmModal } from "./loginModals/AccConfirmModal";
import { ForgotPassModal } from "./loginModals/ForgotPassModal";
import { ForgotPassUsernameModal } from "./loginModals/ForgotPassUsernameModal";

export const LoginModals: React.FC = () => {
  const isOpenSignIn = useLoginModalStore((state) => state.isOpenSignIn);
  const isOpenSignUp = useLoginModalStore((state) => state.isOpenSignUp);
  const isOpenAccConfirm = useLoginModalStore((state) => state.isOpenAccConfirm);
  const isOpenForgotPass = useLoginModalStore((state) => state.isOpenForgotPass);
  const isOpenForgotPassUsername = useLoginModalStore(
    (state) => state.isOpenForgotPassUsername
  );

  return (
    <>
      {isOpenSignIn && <SignInModal />}
      {isOpenSignUp && <SignUpModal />}
      {isOpenAccConfirm && <AccConfirmModal />}
      {isOpenForgotPassUsername && <ForgotPassUsernameModal />}
      {isOpenForgotPass && <ForgotPassModal />}
    </>
  );
};
