import { useState } from "react";

export const SignUpModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasMinLength = password.length >= 8;
  const isValid = hasLowercase && hasUppercase && hasNumber && hasMinLength;
    
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return(
    <>
      <span className="cursor-pointer text-[var(--highlight-text)]" onClick={handleOpen}>
        Sign Up
      </span>

      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/70" onClick={handleClose}>
          <div className="bg-[var(--secondary-bg)] border border-[var(--primary-border)] rounded-xl mx-5 p-8 w-100 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center items-center mb-2">
              <div className="w-12">
                <img src="/studysurf_final.png" className="object-contain" alt="StudySurf Logo" />
              </div>
              <h1 className="text-[var(--highlight-text)] text-4xl ml-3 font-semibold">StudySurf</h1>
            </div>
            
            <form>
              {/* email */}
              <div>
                <label className="block mb-1">Email</label>
                <input type="email" placeholder="Enter Email" autoComplete="off" className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
              </div>
              {/* username */}
              <div>
                <label className="block mb-1">Username</label>
                <input type="username" placeholder="Enter Username" className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
              </div>
              {/* password */}
              <div className="relative">
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
              
              <button disabled={!isValid} type="submit" className={`border px-5 py-2 mt-2 rounded-lg font-semibold transition-all duration-150 ${isValid ? "text-[var(--highlight-text)] hover:bg-[var(--highlight-text)] cursor-pointer hover:text-[var(--secondary-bg)]" : "opacity-20"}`}>Sign up</button>
            </form>
            
            {/* or */}
            <div className="flex items-center gap-2 my-2">
              <div className="flex-grow h-px bg-[var(--primary-border)]"></div>
              <span className="text-[var(--primary-border)]">or</span>
              <div className="flex-grow h-px bg-[var(--primary-border)]"></div>
            </div>
            
            <div className="text-center hover:underline cursor-pointer">Sign in</div>
          </div>
        </div>
      )}
    </>
  )
}