import { useState, useEffect } from "react";
import { api } from "../../api/LoginApi";

interface ForgotPassProps {
  setIsOpenForgotPass: (state: boolean) => void;
}

export const ForgotPassModal = ({setIsOpenForgotPass}: ForgotPassProps) => {

  useEffect(() => {
    const sendConfirmation = async () => {
      try {
        const response = await api.post('/fogetPass')
        console.log('sent');
        handleClose();
      } catch (error) {
        console.error(error);
      }
    }
    sendConfirmation();
  }, [])

  const handleClose = () => setIsOpenForgotPass(false);

  const forgetPassword = () => {
    
    handleClose();
  }
  
  return(
    <>
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/70">
        <div className="bg-[var(--secondary-bg)] border border-[var(--primary-border)] rounded-xl mx-5 p-8 w-100 overflow-hidden">
          <div className="flex justify-center items-center mb-2">
            <div className="w-12">
              <img src="/studysurf_final.png" className="object-contain" alt="StudySurf Logo" />
            </div>
            <h1 className="text-[var(--highlight-text)] text-4xl ml-3 font-semibold">StudySurf</h1>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault(); 
            forgetPassword();
          }}>
            <div>
              <label className="block mb-1">New Password</label>
              <input type="password" placeholder="Enter New Password" className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
            </div>
            <div className="relative">
              <label className="block mb-1">Verification Code</label>
              <input type="text" placeholder="Enter Verification Code" className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
            </div>
            
            <button type="submit" className="border px-5 py-2 mt-2 rounded-lg font-semibold transition-all duration-150 text-[var(--highlight-text)] hover:bg-[var(--highlight-text)] cursor-pointer hover:text-[var(--secondary-bg)]">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}