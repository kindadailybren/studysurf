import { useAuthStore } from "../stores/authStore";
import { useLoginModalStore } from "../stores/loginModalStore";

import { SignUpModal } from "./loginModals/SignUpModal";
import { SignInModal } from "./loginModals/SignInModal";
import { AccConfirmModal } from "./loginModals/AccConfirmModal";
import { ForgotPassModal } from "./loginModals/ForgotPassModal";
import { ForgotPassUsernameModal } from "./loginModals/ForgotPassUsernameModal";

export const User = () => {
  const username = useAuthStore((state) => state.username);

  const isOpenSignIn = useLoginModalStore((state) => state.isOpenSignIn);
  const isOpenSignUp = useLoginModalStore((state) => state.isOpenSignUp);
  const isOpenAccConfirm = useLoginModalStore((state) => state.isOpenAccConfirm);
  const isOpenForgotPass = useLoginModalStore((state) => state.isOpenForgotPass);
  const isOpenForgotPassUsername = useLoginModalStore((state) => state.isOpenForgotPassUsername);

  const setIsOpenSignIn = useLoginModalStore((state) => state.setIsOpenSignIn);
  const setIsOpenSignUp = useLoginModalStore((state) => state.setIsOpenSignUp);

  const handleOpenSignIn = () => setIsOpenSignIn(true);
  const handleOpenSignUp = () => setIsOpenSignUp(true);
  
  return (
    <>
      {username ?
      <>
        <span className="cursor-pointer text-[var(--highlight-text)]">
          {username}
        </span>
        <br/>
      </>
      :
      <>
        <span className="cursor-pointer text-[var(--highlight-text)]" onClick={handleOpenSignIn}>
          Sign In
        </span><br/>
        <span className="cursor-pointer text-[var(--highlight-text)]" onClick={handleOpenSignUp}>
          Sign Up
        </span>
      </>
      }

      {isOpenSignIn && <SignInModal/>}

      {isOpenSignUp && <SignUpModal/>}

      {isOpenAccConfirm && <AccConfirmModal/>}

      {isOpenForgotPassUsername && <ForgotPassUsernameModal/>}
      
      {isOpenForgotPass && <ForgotPassModal/>}
    </>
  );
}
 // a lot of stuff here have to be zustaned