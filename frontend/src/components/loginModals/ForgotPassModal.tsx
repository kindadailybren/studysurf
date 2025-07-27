import { useState } from "react";
import { LoadingBar } from "../LoadingBar";
import { api } from "../../api/LoginApi";

interface ForgotPassProps {
  setIsOpenForgotPass: (state: boolean) => void;
  username: string;
}

export const ForgotPassModal = ({setIsOpenForgotPass, username}: ForgotPassProps) => {
// STATES:

  // inputs and error handling 
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const isValid = password && confirmationCode;

// FUNCTIONS:

  // opening and closing modals
  const handleClose = () => setIsOpenForgotPass(false);

  // api fetching
  const fogetPassConfirm = async () => {
    try {
      setLoading(true);
      const response = await api.post('/forgetPassConfirm', {username, password, confirmationCode})

      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
            fogetPassConfirm();
          }}>

            <div>
              <label className="block mb-1">Confirmation Code</label>
              <input type="text" placeholder="Enter confirmation Code" value={confirmationCode} onChange={e => setConfirmationCode(e.target.value)} className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
            </div>

            <div>
              <label className="block mb-1">New Password</label>
              <input type="password" placeholder="Enter New Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
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