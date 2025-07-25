import { useState } from "react";
import { SignUpModal } from "../components/loginModals/SignUpModal";
import { SignInModal } from "../components/loginModals/SignInModal";
import { AccConfirmModal } from "../components/loginModals/AccConfirmModal";
import { ForgotPassModal } from "../components/loginModals/ForgotPassModal";

export const Login = () => {
  const [isOpenSignIn, setIsOpenSignIn] = useState(false);
  const [isOpenSignUp, setIsOpenSignUp] = useState(false);
  const [isOpenAccConfirm, setIsOpenAccConfirm] = useState(false);
  const [isOpenForgotPass, setIsOpenForgotPass] = useState(false);

  const [usernameInput, setUsernameInput] = useState('');

  const handleOpenSignIn = () => setIsOpenSignIn(true);
  const handleOpenSignUp = () => setIsOpenSignUp(true);
  
  return (
    <>
      <span className="cursor-pointer text-[var(--highlight-text)]" onClick={handleOpenSignIn}>
        Sign In
      </span><br/>
      {isOpenSignIn && <SignInModal setIsOpenSignIn={setIsOpenSignIn} setIsOpenSignUp={setIsOpenSignUp} setIsOpenForgotPass={setIsOpenForgotPass}/>}

      <span className="cursor-pointer text-[var(--highlight-text)]" onClick={handleOpenSignUp}>
        Sign Up
      </span><br/>
      {isOpenSignUp && <SignUpModal setIsOpenSignUp={setIsOpenSignUp} setIsOpenSignIn={setIsOpenSignIn} setIsOpenAccConfirm={setIsOpenAccConfirm} setUsernameInput={setUsernameInput}/>}

      {isOpenAccConfirm && <AccConfirmModal setIsOpenAccConfirm={setIsOpenAccConfirm} setIsOpenSignIn={setIsOpenSignIn} username={usernameInput}/>}
      {isOpenForgotPass && <ForgotPassModal setIsOpenForgotPass={setIsOpenForgotPass}/>}
    </>
  );
}
 // a lot of stuff here have to be zustaned