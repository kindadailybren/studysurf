import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="bg-[#0E0E0E] text-[var(--primary-text)]">
      {/* Hero Section */}
      <div className="relative flex flex-col justify-center items-center h-screen min-h-[600px] overflow-hidden text-center">
        {/* Background Images */}
        <div className="absolute inset-0 flex justify-center items-center gap-x-4 md:gap-x-8 blur-sm scale-105 opacity-50">
          <div className="w-48 md:w-64 h-[28rem] md:h-[32rem] rounded-lg overflow-hidden -rotate-6 transform-gpu">
            <img src="/sample.png" className="w-full h-full object-cover"/>
          </div>
          <div className="w-48 md:w-64 h-[28rem] md:h-[32rem] rounded-lg overflow-hidden transform-gpu">
            <img src="/sample1.jpg" className="w-full h-full object-cover"/>
          </div>
          <div className="w-48 md:w-64 h-[28rem] md:h-[32rem] rounded-lg overflow-hidden rotate-6 transform-gpu">
            <img src="/sample2.png" className="w-full h-full object-cover"/>
          </div>
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/80 to-transparent"></div>

        {/* Centered Content */}
        <div className="relative z-10 flex flex-col items-center px-4">
          <div className="group flex justify-center items-center mb-4 cursor-pointer">
            <div className="w-16 md:w-20 transition-transform duration-300 ease-in-out group-hover:scale-110">
              <img src="/studysurf_final.png" className="object-contain" alt="StudySurf Logo" />
            </div>
            <h1 className="text-[var(--highlight-text)] text-5xl md:text-7xl font-bold ml-4 transition-transform duration-300 ease-in-out group-hover:scale-110">StudySurf</h1>
          </div>
          <p className="text-lg md:text-xl max-w-2xl mb-8 text-gray-300">
            Turn your study documents into visually engaging shorts to appease your brainrot.
          </p>
          <Link to="/upload" className="border-2 border-[var(--highlight-text)] text-[var(--highlight-text)] font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:bg-[var(--highlight-text)] hover:text-[#0E0E0E]">
            Get Started For Free
          </Link>
        </div>
      </div>

      {/* "What is StudySurf?" Section */}
      <div className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What is StudySurf?</h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              This project allows users to convert their study materials (text, notes, or slides) into engaging video formats using a seamless stack of modern web and cloud technologies.
            </p>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="rounded-lg overflow-hidden aspect-video shadow-2xl shadow-black/40">
            {/* gif unta diri na kanang brainrot*/}
              <img src="/sample.png" className="w-full h-full object-cover" alt="A sample video generated by StudySurf" />
            </div>
          </div>
        </div>
      </div>

      {/* Supported File Formats Section */}
      <div className="bg-[#121212] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Supported File Formats</h2>
          <div className="flex justify-center flex-wrap gap-8">
            {/* PDF */}
            <div className="flex flex-col items-center gap-3">
              <div className="bg-gray-800 border-2 border-gray-700 w-24 h-24 rounded-lg flex items-center justify-center text-gray-400 font-semibold transition-all duration-300 ease-in-out hover:border-[var(--highlight-text)] hover:-translate-y-2">
                PDF
              </div>
              <span className="font-medium text-gray-300">PDF</span>
            </div>
            {/* DOCX */}
            <div className="flex flex-col items-center gap-3">
              <div className="bg-gray-800 border-2 border-gray-700 w-24 h-24 rounded-lg flex items-center justify-center text-gray-400 font-semibold transition-all duration-300 ease-in-out hover:border-[var(--highlight-text)] hover:-translate-y-2">
                DOCX
              </div>
              <span className="font-medium text-gray-300">Word</span>
            </div>
            {/* PPTX */}
            <div className="flex flex-col items-center gap-3">
              <div className="bg-gray-800 border-2 border-gray-700 w-24 h-24 rounded-lg flex items-center justify-center text-gray-400 font-semibold transition-all duration-300 ease-in-out hover:border-[var(--highlight-text)] hover:-translate-y-2">
                PPTX
              </div>
              <span className="font-medium text-gray-300">PowerPoint</span>
            </div>
            {/* TXT */}
            <div className="flex flex-col items-center gap-3">
              <div className="bg-gray-800 border-2 border-gray-700 w-24 h-24 rounded-lg flex items-center justify-center text-gray-400 font-semibold transition-all duration-300 ease-in-out hover:border-[var(--highlight-text)] hover:-translate-y-2">
                TXT
              </div>
              <span className="font-medium text-gray-300">Text</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}