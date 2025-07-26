import { useState } from "react";
import { api } from "../../api/LoginApi";
import { LoadingBar } from "../LoadingBar";

interface AccConfirmModalProps {
  setIsOpenAccConfirm: (state:boolean) => void;
  setIsOpenSignIn: (state:boolean) => void;
  username: string
}

export const AccConfirmModal = ({setIsOpenAccConfirm, setIsOpenSignIn, username}: AccConfirmModalProps) => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => setIsOpenAccConfirm(false);

  const confirmUser = async () => {
    try {
      setLoading(true);
      const response = await api.post('/confirmUser', {username, confirmationCode})
      if (response.status === 200) console.log('nice!!!');
      
      setLoading(false);

      handleClose();
      setIsOpenSignIn(true);

    } catch (error) {
      setLoading(false);
      console.error(error);
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
            confirmUser();
          }}>
            <div>
              <label className="block mb-1">Confirmation Code</label>
              <input type="text" placeholder="Enter Confirmation Code" value={confirmationCode} onChange={e => setConfirmationCode(e.target.value)} className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
            </div>
            
            <button disabled={!confirmationCode} type="submit" className={`border px-5 py-2 mt-2 rounded-lg font-semibold transition-all duration-150 ${confirmationCode ? "text-[var(--highlight-text)] hover:bg-[var(--highlight-text)] cursor-pointer hover:text-[var(--secondary-bg)]" : "opacity-20"}`}>{loading ?
              <div className="flex items-center gap-2">
                Sign up
                <LoadingBar/>
              </div> : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}