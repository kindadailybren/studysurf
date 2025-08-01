import axios from "axios";
import { useState, useEffect } from "react";
import { api } from "../../api/Api";
import { useLoginModalStore } from "../../stores/loginModalStore";
import { LoadingBar } from "../LoadingBar";

export const ForgotPassModal = () => {
// STATES:

  // login modal store
  const setIsOpenForgotPass = useLoginModalStore((state) => state.setIsOpenForgotPass);
  const username = useLoginModalStore((state) => state.usernameInput);

  // inputs and error handling 
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // password validation
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasMinLength = password.length >= 8;
  
  const isValid = hasLowercase && hasUppercase && hasNumber && hasMinLength && confirmationCode.trim() && password.trim();
  
  // modal transition
  const [isVisible, setIsVisible] = useState(false);

  // error handling
  const [error, setError] = useState('');

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, [])

// FUNCTIONS:

  // opening and closing modals
  const handleClose = () => {
    setIsVisible(false);
    setIsOpenForgotPass(false);
  }

  // api fetching
  const forgetPassConfirm = async () => {
    try {
      setLoading(true);
      await api.post('/forgetPassConfirm', {username, password, confirmationCode})

      handleClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 400) {
          setError(data?.detail);
        } else {
          setError("Something went wrong.");
        }
      } else {
        setError("Unexpected error.");
        console.error("Non-Axios error:", error);
      }
    } finally {
      setLoading(false);
    }
  }
  
  return(
    <>
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/70">
        <div className={`bg-[var(--secondary-bg)] border border-[var(--primary-border)] rounded-xl mx-5 p-8 w-100 overflow-hidden transform transition-all duration-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}>
          <div className="flex justify-center items-center mb-2">
            <div className="w-12">
              <img src="/studysurf_final.png" className="object-contain" alt="StudySurf Logo" />
            </div>
            <h1 className="text-[var(--highlight-text)] text-4xl ml-3 font-semibold">StudySurf</h1>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault(); 
            forgetPassConfirm();
          }}>

            <div>
              <label className="block mb-1">Confirmation Code</label>
              <input type="text" placeholder="Enter confirmation Code" value={confirmationCode} onChange={e => setConfirmationCode(e.target.value)} className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
            </div>

            <div>
              <label className="block mb-1">New Password</label>
              <input type="password" placeholder="Enter New Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
            </div>
            <ul className={`text-xs ${password || "hidden"}`}>
              <li className={hasMinLength ? "text-green-400" : "text-red-400"}>
                {hasMinLength ? "✓" : "✗"} At least 8 characters
              </li>
              <li className={hasLowercase ? "text-green-400" : "text-red-400"}>
                {hasLowercase ? "✓" : "✗"} At least one lowercase letter (a-z)
              </li>
              <li className={hasUppercase ? "text-green-400" : "text-red-400"}>
                {hasUppercase ? "✓" : "✗"} At least one uppercase letter (A-Z)
              </li>
              <li className={hasNumber ? "text-green-400" : "text-red-400"}>
                {hasNumber ? "✓" : "✗"} At least one number (0-9)
              </li>
            </ul>

            <button disabled={!isValid} type="submit" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className={`border px-5 py-2 mt-2 rounded-lg font-semibold transition-all duration-150 group ${
              isValid
                ? "text-[var(--highlight-text)] hover:bg-[var(--highlight-text)] cursor-pointer hover:text-[var(--secondary-bg)]"
                : "opacity-20"
            }`}>
              {loading ? (
                <div className="flex items-center gap-2">
                  Submit
                  <LoadingBar color={isHovered ? "var(--secondary-bg)" : "var(--highlight-text)"} />
                </div>
              ) : (
                "Submit"
              )}
            </button>
            {error && (
              <p className="text-xs text-red-400 mt-1 ml-1">{error}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}