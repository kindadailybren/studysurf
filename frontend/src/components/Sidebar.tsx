import { useState } from "react"
import '../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faCloudArrowUp, faPhotoFilm, faFileImport } from "@fortawesome/free-solid-svg-icons"
import { FileUpload, SelectVideo, VideoSettings } from './sub-components/mainSub.tsx'

export const Sidebar = () => {
  const [selected, setSelected] = useState("upload");

  const isActive = (item: string) => 
    selected === item
      ? "bg-[var(--highlight-bg)] text-[var(--highlight-text)]"
      : "hover:bg-[var(--highlight-bg)] hover:text-[var(--highlight-text)]";
  

  return (
    <div className="flex flex-col gap-y-2 w-60 h-screen pt-5 px-3">
      <div className="flex mb-5">
        <img src="/studysurf_final.png" className="h-8 pr-2"></img>
        <h1 className="text-[#82B6E0] text-4xl font-[Kantumruy] ">StudySurf</h1>
      </div>
      <div
        className={`flex items-center gap-x-5 px-4 py-3 rounded-xl cursor-pointer transition ${isActive("upload")}`}
        onClick={() => setSelected("upload")}
      >
        <FontAwesomeIcon icon={faCloudArrowUp} size="2xl" />
        <h1>Upload</h1>
      </div>

      <div
        className={`flex items-center gap-x-5 px-4 py-3 rounded-xl cursor-pointer transition ${isActive("gallery")}`}
        onClick={() => setSelected("gallery")}
      >
        <FontAwesomeIcon icon={faPhotoFilm} size="2xl" />
        <h1>Gallery</h1>
      </div>

      <div
        className={`flex items-center gap-x-5 px-4 py-3 rounded-xl cursor-pointer transition ${isActive("settings")}`}
        onClick={() => setSelected("settings")}
      >
        <FontAwesomeIcon icon={faGear} size="2xl" />
        <h1>Settings</h1>
      </div>

    </div>
  );
}


export const Main = () => {

  return (
    <>
      <div className="flex items-center justify-center border-[var(--primary-border)] w-full h-screen mb-10">
        <form className="w-[88%] h-[88%] mb-10">
          <FileUpload/>
          <SelectVideo/>
          <VideoSettings/>
        </form>
      </div>
    </>
  )
}
