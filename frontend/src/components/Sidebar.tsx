import '../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faCloudArrowUp, faPhotoFilm } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react";
import { FileUpload, SelectVideo, VideoSettings } from './sub-components/mainSub.tsx'

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <>
      <div className="group flex flex-col gap-y-2 border-r border-[var(--primary-border)] w-21.5 h-auto pt-5 px-2 overflow-hidden hover:w-50 transition-all duration-200">
        <div onClick={() => setActiveTab("upload")} className={`flex items-center gap-x-5 px-3 py-3 rounded-xl cursor-pointer transition duration-200 ease-in-out ${activeTab === "upload" ? "bg-[var(--highlight-bg)] text-[var(--highlight-text)]" : "hover:bg-[var(--highlight-bg)] hover:text-[var(--highlight-text)]"}`}>
          <FontAwesomeIcon icon={faCloudArrowUp} size="2xl" />
          <h1 className="text-center opacity-0 group-hover:opacity-100">Upload</h1>
        </div>
        <div onClick={() => setActiveTab("gallery")} className={`flex items-center gap-x-5 px-3 py-3 rounded-xl cursor-pointer transition duration-200 ease-in-out ${activeTab === "gallery"
              ? "bg-[var(--highlight-bg)] text-[var(--highlight-text)]" : "hover:bg-[var(--highlight-bg)] hover:text-[var(--highlight-text)]"}`}>
          <FontAwesomeIcon icon={faPhotoFilm} size="2xl" />
          <h1 className="text-center opacity-0 group-hover:opacity-100">Gallery</h1>
        </div>
        <div onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-x-5 px-3 py-3 pl-4 rounded-xl cursor-pointer transition duration-200 ease-in-out ${activeTab === "settings" ? "bg-[var(--highlight-bg)] text-[var(--highlight-text)]" : "hover:bg-[var(--highlight-bg)] hover:text-[var(--highlight-text)]"}`}>
          <FontAwesomeIcon icon={faGear} size="2xl" />
          <h1 className="text-center opacity-0 group-hover:opacity-100">Settings</h1>
        </div>
      </div>
    </>
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
