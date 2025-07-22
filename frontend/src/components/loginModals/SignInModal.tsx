import { useState } from "react";

export const SignInModal = () => {
  const [isOpen, setIsOpen] = useState(false);
    
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return(
    <>
      <span className="cursor-pointer text-[var(--highlight-text)]" onClick={handleOpen}>
        Sign In
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
              {/* username */}
              <div>
                <label className="block mb-1">Username</label>
                <input type="username" placeholder="Enter Username" className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
              </div>
              {/* password */}
              <div className="relative">
                <label className="block mb-1">Password</label>
                <input type="password" placeholder="Enter Password" className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
                <span className="absolute hover:underline text-xs cursor-pointer right-0 -bottom-4">Forgot Password?</span>
              </div>
              
              <button type="submit" className="border px-5 py-2 mt-2 rounded-lg font-semibold transition-all duration-150 text-[var(--highlight-text)] hover:bg-[var(--highlight-text)] cursor-pointer hover:text-[var(--secondary-bg)]">Sign in</button>
            </form>
            
            {/* or */}
            <div className="flex items-center gap-2 my-4">
              <div className="flex-grow h-px bg-[var(--primary-border)]"></div>
              <span className="text-[var(--primary-border)]">or</span>
              <div className="flex-grow h-px bg-[var(--primary-border)]"></div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-[var(--highlight-text)] hover:bg--[var(--highlight-text)] text-[var(--secondary-bg)] py-2 mb-2 rounded-md cursor-pointer">
              <img src="" className="w-4 h-4"/>
              Sign in With Google
            </button>
            <div className="text-center hover:underline cursor-pointer">Create Account</div>
          </div>
        </div>
      )}
    </>
  )
}

// things that could be improved:
// - variables for colors
// - more responsive
// - use rems or tailwind values instead of yea