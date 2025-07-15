import { useState } from "react"

export const VideoThumbnail = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  
  return(
    <>
      <div className="border rounded-md overflow-hidden aspect-[9/16] cursor-pointer" onClick={handleOpen}>
        <img src="/sample.png" className="w-full h-full object-cover brightness-30 transition-all delay-50 hover:brightness-70" />
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50" onClick={handleClose}>
          <div className="relative bg-[var(--primary-bg)] rounded-lg shadow-lg max-w-180 max-h-170 mx-5 p-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button onClick={handleClose} className="absolute top-1 right-3 text-3xl cursor-pointer z-10">&times;</button>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="aspect-[9/16] bg-black rounded-md overflow-hidden">
                  <video src="/clip.mp4" controls autoPlay className="w-full h-full object-cover"/>
                </div>
              </div>
              <div className="flex-1 p-2 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-4">Title</h1>
                <p className="text-sm">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt, obcaecati perspiciatis provident, quos atque quibusdam cupiditate enim laudantium rem blanditiis sint tenetur totam, hic nostrum reprehenderit iste magni iusto illum.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}