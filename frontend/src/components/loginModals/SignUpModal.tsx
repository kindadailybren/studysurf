import { useState, useRef } from "react";
import { api } from "../../api/LoginApi";
import { LoadingBar } from "../LoadingBar";

interface SignUpModalProps {
  setIsOpenSignUp: (state: boolean) => void;
  setIsOpenSignIn: (state: boolean) => void;
  setIsOpenAccConfirm: (state: boolean) => void;
  setUsernameInput: (state: string) => void;
}

export const SignUpModal = ({setIsOpenSignUp, setIsOpenSignIn, setIsOpenAccConfirm, setUsernameInput}: SignUpModalProps) => {
// STATES:

  // inputs and error handling 
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // accidental exit, highlighting problem
  const modalRef = useRef<HTMLDivElement>(null);
  const [mouseDownInside, setMouseDownInside] = useState(false);
  
  // password validation
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasMinLength = password.length >= 8;

  const isValid = hasLowercase && hasUppercase && hasNumber && hasMinLength && username && email;


// FUNCTIONS:

  // opening and closing modals
  const handleClose = () => setIsOpenSignUp(false);

  const handleOpenSignIn = () => {
    handleClose();
    setIsOpenSignIn(true);
  }

  // api fetching
  const createUser = async () => {
    try {
      setLoading(true);
      const trimmedEmail = email.trim();
      const trimmedUsername = username.trim();
      
      const response = await api.post('/createUser', {
        email: trimmedEmail,
        username: trimmedUsername,
        password: password
      })

      if (response.status === 200) console.log('sent');
      
      setUsernameInput(username)
      setLoading(false);

      handleClose();
      setIsOpenAccConfirm(true);

    } catch (error) {
      console.error(error);
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
            createUser();
          }}>

            {/* email */}
            <div>
              <label className="block mb-1">Email</label>
              <input type="email" placeholder="Enter Email" pattern="^[^@]+@[^@.]+(\.[^@.]+)+$" value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
            </div>

            {/* username */}
            <div>
              <label className="block mb-1">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter Username" className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
            </div>

            {/* password */}
            <div>
              <label className="block mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter Password" className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
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
          </form>
          
          {/* or */}
          <div className="flex items-center gap-2 my-2">
            <div className="flex-grow h-px bg-[var(--primary-border)]"></div>
            <span className="text-[var(--primary-border)]">or</span>
            <div className="flex-grow h-px bg-[var(--primary-border)]"></div>
          </div>
          
          <div className="text-center hover:underline cursor-pointer" onClick={handleOpenSignIn}>Sign in</div>
        </div>
      </div>
    </>
  )
}