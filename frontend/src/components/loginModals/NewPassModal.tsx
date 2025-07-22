import { useState } from "react";

export const NewPassModal = () => {
  const [isOpen, setIsOpen] = useState(false);
          
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  
  return(
    <>
      <span className="cursor-pointer text-[var(--highlight-text)]" onClick={handleOpen}>
        Pass Confirm
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
              <div>
                <label className="block mb-1">New Password</label>
                <input type="password" placeholder="Enter New Password" className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
              </div>
              <div className="relative">
                <label className="block mb-1">Verification Code</label>
                <input type="text" placeholder="Enter Verification Code" className="w-full px-4 py-2 mb-2 rounded-md bg-transparent border border-[var(--primary-border)] focus:outline-none focus:ring-1 focus:ring-[var(--highlight-text)]" required/>
              </div>
              
              <button type="submit" className="border px-5 py-2 mt-2 rounded-lg font-semibold transition-all duration-150 text-[var(--highlight-text)] hover:bg-[var(--highlight-text)] cursor-pointer hover:text-[var(--secondary-bg)]">Submit</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
