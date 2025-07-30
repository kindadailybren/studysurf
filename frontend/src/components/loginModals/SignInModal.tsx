import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { api } from "../../api/LoginApi";
import { useAuthStore } from "../../stores/authStore";
import { useLoginModalStore } from "../../stores/loginModalStore";

import { LoadingBar } from "../LoadingBar";


export const SignInModal = () => {
//  STATES:

  // login modal store
  const setIsOpenForgotPassUsername = useLoginModalStore((state) => state.setIsOpenForgotPassUsername);
  const setIsOpenSignIn = useLoginModalStore((state) => state.setIsOpenSignIn);
  const setIsOpenSignUp = useLoginModalStore((state) => state.setIsOpenSignUp);

  // auth store
  const setAccessTokenStore = useAuthStore((state) => state.setAccessToken);
  const setIdTokenStore = useAuthStore((state) => state.setIdToken);
  const setUsernameStore = useAuthStore((state) => state.setUsername);
  
  // inputs and error handling 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // accidental exit, highlighting problem
  const modalRef = useRef<HTMLDivElement>(null);
  const [mouseDownInside, setMouseDownInside] = useState(false);
  
  const isValid = username.trim() && password.trim();
  
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
    setIsOpenSignIn(false);
  }

  const handleOpenSignUp = () => {
    handleClose();
    setIsOpenSignUp(true);
  }

  const handleForgotPass = () => {
    handleClose();
    setIsOpenForgotPassUsername(true);
  }
  
  // api fetching, and storing states
  const loginUser = async () => {
    try {
      setLoading(true);
      const response = await api.post('/login', {username, password})
      
      const { accessToken, idToken, username: newUsername } = response.data;
      
      setAccessTokenStore(accessToken);
      setIdTokenStore(idToken);
      setUsernameStore(newUsername);

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
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/70" 
        onMouseDown={(e) => {
          if (modalRef.current?.contains(e.target as Node)) {
            setMouseDownInside(true);
          } else {
            setMouseDownInside(false);
          }
        }}
        onMouseUp={() => {
          if (!mouseDownInside) {
            handleClose();
          }
        }}>
        <div className={`bg-[var(--secondary-bg)] border border-[var(--primary-border)] rounded-xl mx-5 p-8 w-100 overflow-hidden transform transition-all duration-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`} ref={modalRef}>
          <div className="flex justify-center items-center mb-2">
            <div className="w-12">
              <img src="/studysurf_final.png" className="object-contain" alt="StudySurf Logo" />
            </div>
            <h1 className="text-[var(--highlight-text)] text-4xl ml-3 font-semibold">StudySurf</h1>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            loginUser();
          }}>

            {/* username */}
            <div>
              <label className="block mb-1">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter Username" className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
            </div>
            
            {/* password */}
            <div className="relative">
              <label className="block mb-1">Password</label>
              <input type="password" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
              <span className="absolute hover:underline text-xs cursor-pointer right-0 -bottom-4" onClick={handleForgotPass}>Forgot Password?</span>
            </div>
            
            {/* button */}
            <button disabled={!isValid || loading} type="submit" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className={`border px-5 py-2 mt-2 rounded-lg font-semibold transition-all duration-150 group ${
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
          
          {/* or line */}
          <div className="flex items-center gap-2 my-4">
            <div className="flex-grow h-px bg-[var(--primary-border)]"></div>
            <span className="text-[var(--primary-border)]">or</span>
            <div className="flex-grow h-px bg-[var(--primary-border)]"></div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-[var(--highlight-text)] text-[var(--secondary-bg)] py-2 mb-2 rounded-md cursor-pointer">
            <img src="" className="w-4 h-4"/>
            Sign in With Google
          </button>

          <div className="text-center hover:underline cursor-pointer" onClick={handleOpenSignUp}>
            Create Account
          </div>
        </div>
      </div>
    </>
  )
}