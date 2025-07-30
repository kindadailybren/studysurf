import axios from "axios";
import { useState, useEffect } from "react";
import { api } from "../../api/LoginApi";
import { useLoginModalStore } from "../../stores/loginModalStore";
import { LoadingBar } from "../LoadingBar";

export const AccConfirmModal = () => {
// STATES:

  // login modal store
  const setIsOpenAccConfirm = useLoginModalStore((state) => state.setIsOpenAccConfirm);
  const setIsOpenSignIn = useLoginModalStore((state) => state.setIsOpenSignIn);
  const username = useLoginModalStore((state) => state.usernameInput);

  // inputs and error handling 
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isValid = confirmationCode.trim();
  
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
    setIsOpenAccConfirm(false);
  }

  // api fetching, and storing states
  const confirmUser = async () => {
    try {
      setLoading(true);
      const response = await api.post('/confirmUser', {username, confirmationCode})
      if (response.status === 200) console.log('nice!!!');
      
      handleClose();
      setIsOpenSignIn(true);

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
            confirmUser();
          }}>
            <div>
              <label className="block mb-1">Confirmation Code</label>
              <input type="text" placeholder="Enter Confirmation Code" value={confirmationCode} onChange={e => setConfirmationCode(e.target.value)} className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
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
            {error && (
              <p className="text-xs text-red-400 mt-1 ml-1">{error}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}