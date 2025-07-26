import { useState } from "react";
import { LoadingBar } from "../LoadingBar";
import { api } from "../../api/LoginApi";

interface ForgotPassUsernameProps {
  setIsOpenForgotPass: (state: boolean) => void;
  setIsOpenForgotPassUsername: (state: boolean) => void;
  setUsernameInput: (state: string) => void;
}

export const ForgotPassUsernameModal = ({setIsOpenForgotPass, setIsOpenForgotPassUsername, setUsernameInput}: ForgotPassUsernameProps) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => setIsOpenForgotPassUsername(false);

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
            forgetPass();
          }}>
            <div>
              <label className="block mb-1">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter Username" className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
            </div>
            <button disabled={!username} type="submit" className={`border px-5 py-2 mt-2 rounded-lg font-semibold transition-all duration-150 ${username ? "text-[var(--highlight-text)] hover:bg-[var(--highlight-text)] cursor-pointer hover:text-[var(--secondary-bg)]" : "opacity-20"}`}>{loading ?
              <div className="flex items-center gap-2">
                Submit
                <LoadingBar/>
              </div> : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}