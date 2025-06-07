
import '../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faCloudArrowUp, faPhotoFilm, faFileImport } from "@fortawesome/free-solid-svg-icons"

export const Sidebar = () => {
  return (
    <>
      <div className="flex flex-col gap-y-2 border-r-1 border-[var(--primary-border)] w-60 h-auto pt-5 px-3">
        <div className="flex items-center gap-x-5 px-4 py-3 bg-[var(--highlight-bg)] rounded-xl text-[var(--highlight-text)]">
          <FontAwesomeIcon icon={faCloudArrowUp} size="2xl"/>
          <h1 className="text-center">Upload</h1>
        </div>
        <div className="flex items-center gap-x-5 px-4 py-3 transition duration-200 ease-in-out hover:bg-[var(--highlight-bg)] rounded-xl hover:text-[var(--highlight-text)] cursor-pointer">
          <FontAwesomeIcon icon={faPhotoFilm} size="2xl"/>
          <h1 className="">Gallery</h1>
        </div>
        <div className="flex items-center gap-x-5 px-4 py-3 transition duration-200 ease-in-out hover:bg-[var(--highlight-bg)] rounded-xl hover:text-[var(--highlight-text)] cursor-pointer">
          <FontAwesomeIcon icon={faGear} size="2xl"/>
          <h1 className="">Settings</h1>
        </div>
      </div>
    </>
  )
}


export const Main = () => {
  return (
    <>
      <div className="flex items-center justify-center border-[var(--primary-border)] w-full h-[calc(100vh-93px)] px-40 py-20">
        <div className="h-full w-full border-4 border-[var(--primary-border)] border-dashed text-center flex flex-col gap-3 items-center justify-center rounded-2xl bg-[var(--secondary-bg)]">
          <FontAwesomeIcon icon={faFileImport} size="xl" style={{color: "#3b94dc",}} />
          Drag your Study Material Here <br/> (PDF, PPT, etc.)
        </div>
      </div>
    </>
  )
}
