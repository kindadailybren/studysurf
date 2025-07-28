import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { DeleteUserButton } from "./DeleteUserButton";
import { LogoutUserButton } from "./LogoutUserButton";

import { SignUpModal } from "./loginModals/SignUpModal";
import { SignInModal } from "./loginModals/SignInModal";
import { AccConfirmModal } from "./loginModals/AccConfirmModal";
import { ForgotPassModal } from "./loginModals/ForgotPassModal";
import { ForgotPassUsernameModal } from "./loginModals/ForgotPassUsernameModal";

export const User = () => {
  const username = useAuthStore((state) => state.username);

  const [isOpenSignIn, setIsOpenSignIn] = useState(false);
  const [isOpenSignUp, setIsOpenSignUp] = useState(false);
  const [isOpenAccConfirm, setIsOpenAccConfirm] = useState(false);
  const [isOpenForgotPass, setIsOpenForgotPass] = useState(false);
  const [isOpenForgotPassUsername, setIsOpenForgotPassUsername] = useState(false);

  const [usernameInput, setUsernameInput] = useState('');

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
        <LogoutUserButton/>
        <DeleteUserButton/>
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

      {isOpenSignIn && <SignInModal setIsOpenSignIn={setIsOpenSignIn} setIsOpenSignUp={setIsOpenSignUp} setIsOpenForgotPassUsername={setIsOpenForgotPassUsername}/>}

      {isOpenSignUp && <SignUpModal setIsOpenSignUp={setIsOpenSignUp} setIsOpenSignIn={setIsOpenSignIn} setIsOpenAccConfirm={setIsOpenAccConfirm} setUsernameInput={setUsernameInput}/>}

      {isOpenAccConfirm && <AccConfirmModal setIsOpenAccConfirm={setIsOpenAccConfirm} setIsOpenSignIn={setIsOpenSignIn} username={usernameInput}/>}

      {isOpenForgotPassUsername && <ForgotPassUsernameModal setIsOpenForgotPass={setIsOpenForgotPass} setIsOpenForgotPassUsername={setIsOpenForgotPassUsername} setUsernameInput={setUsernameInput}/>}
      
      {isOpenForgotPass && <ForgotPassModal setIsOpenForgotPass={setIsOpenForgotPass} username={usernameInput}/>}
    </>
  );
}
 // a lot of stuff here have to be zustaned