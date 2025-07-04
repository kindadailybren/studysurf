import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <>
      <div className="relative flex justify-center gap-2 py-10 h-150">
        <div className="border rounded-lg overflow-hidden aspect-[9/16]">
          <img src="/sample.png" className="w-full h-full object-cover brightness-20" />
        </div>
        <div className="border rounded-lg overflow-hidden aspect-[9/16]">
          <img src="/sample.png" className="w-full h-full object-cover brightness-20" />
        </div>
        <div className="border rounded-lg overflow-hidden aspect-[9/16]">
          <img src="/sample.png" className="w-full h-full object-cover brightness-20" />
        </div>

        <div className="absolute inset-0 text-[var(--primary-text)] flex flex-col items-center justify-center">
          <div className="flex justify-center items-center">
            <div className="w-18">
              <img src="/studysurf_final.png" className="object-contain" />
            </div>
            <h1 className="text-[var(--highlight-text)] text-6xl font-semibold ml-2">StudySurf</h1>
          </div>
          <Link to="/upload" className="border-2 p-3 m-3 rounded-xl cursor-pointer transition duration-200 hover:border-[var(--highlight-text)] hover:text-[var(--highlight-text)]">
            Get Started
          </Link>
        </div>
      </div>

      <div className="flex justify-center py-20 h-150 text-[var(--primary-text)]">
        <div className="flex-5 px-10 py-15 max-w-150 text-2xl">
          <h1 className="text-4xl font-semibold">What is StudySurf?</h1>
          <p className="mt-6">Turn your study documents into visually inducing videos.</p>
          <p className="mt-3">This project allows users to convert their study materials (text, notes, or slides) into engaging video formats using a seamless  stack of modern web and cloud technologies. </p>
        </div>
        <div className="rounded-lg overflow-hidden aspect-[9/16]">
          <img src="/sample.png" className="w-full h-full object-cover brightness-20" />
        </div>
      </div>

      <div className="text-center text-2xl font-semibold py-10 text-[var(--primary-text)]">
        <h1>Supported File Formats</h1>
        <div className="flex justify-center gap-3 mt-3">
          <div className="border border-amber-50 w-20 h-20"></div>
          <div className="border border-amber-50 w-20 h-20"></div>
          <div className="border border-amber-50 w-20 h-20"></div>
        </div>
      </div>
      
    </>
  );
}
