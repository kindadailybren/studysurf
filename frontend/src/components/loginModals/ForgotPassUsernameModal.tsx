import { useState, useRef } from "react";
import { LoadingBar } from "../LoadingBar";
import { api } from "../../api/LoginApi";

interface ForgotPassUsernameProps {
  setIsOpenForgotPass: (state: boolean) => void;
  setIsOpenForgotPassUsername: (state: boolean) => void;
  setUsernameInput: (state: string) => void;
}

export const ForgotPassUsernameModal = ({setIsOpenForgotPass, setIsOpenForgotPassUsername, setUsernameInput}: ForgotPassUsernameProps) => {
// STATES:

  // inputs and error handling 
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // accidental exit, highlighting problem
  const modalRef = useRef<HTMLDivElement>(null);
  const [mouseDownInside, setMouseDownInside] = useState(false);

  const isValid = username;

// FUNCTIONS:

  // opening and closing modals
  const handleClose = () => setIsOpenForgotPassUsername(false);

  // api fetching
  const forgetPass = async () => {
    try {
      setLoading(true);
      await api.post('/forgetPass', null, {
        params: { username }
      });
      setUsernameInput(username);
      setIsOpenForgotPass(true);
      console.log('u sent username')
      handleClose();
    } catch (error) {
      const status = error.response?.status;
      console.log(error);
      if (status === 400) {
        console.log('user not found');
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
        <div className="bg-[var(--secondary-bg)] border border-[var(--primary-border)] rounded-xl mx-5 p-8 w-100 overflow-hidden" ref={modalRef}>
          <div className="flex justify-center items-center mb-2">
            <div className="w-12">
              <img src="/studysurf_final.png" className="object-contain" alt="StudySurf Logo" />
            </div>
            <h1 className="text-[var(--highlight-text)] text-4xl ml-3 font-semibold">StudySurf</h1>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault(); 
            forgetPass();
          }}>
            <div>
              <label className="block mb-1">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter Username" className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
            </div>
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
          </form>
        </div>
      </div>
    </>
  );
}