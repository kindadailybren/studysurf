import { useState } from "react";
import { SignUpModal } from "../components/loginModals/SignUpModal";
import { SignInModal } from "../components/loginModals/SignInModal";
import { AccConfirmModal } from "../components/loginModals/AccConfirmModal";
import { ForgotPassModal } from "../components/loginModals/ForgotPassModal";
import { ForgotPassUsernameModal } from "./loginModals/ForgotPassUsernameModal";

export const Login = () => {
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
      <span className="cursor-pointer text-[var(--highlight-text)]" onClick={handleOpenSignIn}>
        Sign In
      </span><br/>
      {isOpenSignIn && <SignInModal setIsOpenSignIn={setIsOpenSignIn} setIsOpenSignUp={setIsOpenSignUp} setIsOpenForgotPassUsername={setIsOpenForgotPassUsername}/>}

      <span className="cursor-pointer text-[var(--highlight-text)]" onClick={handleOpenSignUp}>
        Sign Up
      </span><br/>
      {isOpenSignUp && <SignUpModal setIsOpenSignUp={setIsOpenSignUp} setIsOpenSignIn={setIsOpenSignIn} setIsOpenAccConfirm={setIsOpenAccConfirm} setUsernameInput={setUsernameInput}/>}

      {isOpenAccConfirm && <AccConfirmModal setIsOpenAccConfirm={setIsOpenAccConfirm} setIsOpenSignIn={setIsOpenSignIn} username={usernameInput}/>}
      {isOpenForgotPassUsername && <ForgotPassUsernameModal setIsOpenForgotPass={setIsOpenForgotPass} setIsOpenForgotPassUsername={setIsOpenForgotPassUsername} setUsernameInput={setUsernameInput}/>}
      {isOpenForgotPass && <ForgotPassModal setIsOpenForgotPass={setIsOpenForgotPass} username={usernameInput}/>}
    </>
  );
}
 // a lot of stuff here have to be zustaned