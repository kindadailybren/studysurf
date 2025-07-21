import { useState } from "react";

export const SignInModal = () => {
  const [isOpen, setIsOpen] = useState(true);
    
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return(
    <>
      <span className="cursor-pointer text-[var(--highlight-text)]" onClick={handleOpen}>
        Sign In
      </span>

      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/70" onClick={handleClose}>
          <div className="bg-[var(--secondary-bg)] border border-[var(--primary-border)] rounded-xl w-120 h-100 mx-5 py-8 px-10 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center items-center mb-2">
              <div className="w-12">
                <img src="/studysurf_final.png" className="object-contain" alt="StudySurf Logo" />
              </div>
              <h1 className="text-[var(--highlight-text)] text-4xl ml-3 font-semibold">StudySurf</h1>
            </div>
            
            <form>
              <div>
                <label className="block mb-1">Username</label>
                <input type="username" id="username" name="username" placeholder="Enter Username" autoComplete="off" className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
              </div>
              <div>
                <label className="block mb-1">Password</label>
                <input type="password" id="password" name="password" placeholder="Enter Password" autoComplete="off" className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
              </div>
              
              <button type="submit" className="border px-5 py-1 mt-2 rounded-lg cursor-pointer text-[var(--highlight-text)]">Sign In</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}