import '../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faCloudArrowUp, faPhotoFilm } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react";

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <>
      <div className="group flex flex-col gap-y-2 border-r border-[var(--primary-border)] w-19.5 h-auto pt-5 overflow-hidden hover:w-53 transition-all duration-200">
        <div className="grid grid-cols-[40px_1fr] gap-x-3 px-2 py-3 mx-3 rounded-xl transition-all duration-200 ease-in-out group-hover:px-0">
          <div className="flex justify-center">
            <img src="/studysurf_final.png"></img>
          </div>
          <h1 className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-[var(--highlight-text)] text-3xl">StudySurf</h1>
        </div>
        <div onClick={() => setActiveTab("upload")} className={`grid grid-cols-[30px_1fr] gap-x-8 px-3 py-3 mx-3 rounded-xl cursor-pointer transition duration-200 ease-in-out ${activeTab === "upload" ? "bg-[var(--highlight-bg)] text-[var(--highlight-text)]" : "hover:bg-[var(--highlight-bg)] hover:text-[var(--highlight-text)]"}`}>
          <div className="flex justify-center">
            <FontAwesomeIcon icon={faCloudArrowUp} size="xl" />
          </div>
          <h1 className="opacity-0 group-hover:opacity-100 transition-all duration-200">Upload</h1>
        </div>
        <div onClick={() => setActiveTab("gallery")} className={`grid grid-cols-[30px_1fr] gap-x-8 px-3 py-3 mx-3 rounded-xl cursor-pointer transition duration-200 ease-in-out ${activeTab === "gallery" ? "bg-[var(--highlight-bg)] text-[var(--highlight-text)]" : "hover:bg-[var(--highlight-bg)] hover:text-[var(--highlight-text)]"}`}>
          <div className="flex justify-center">
            <FontAwesomeIcon icon={faPhotoFilm} size="xl" />
          </div>
          <h1 className="opacity-0 group-hover:opacity-100 transition-all duration-200">Gallery</h1>
        </div>
        <div onClick={() => setActiveTab("settings")} className={`grid grid-cols-[30px_1fr] gap-x-8 px-3 py-3 mx-3 rounded-xl cursor-pointer transition duration-200 ease-in-out ${activeTab === "settings" ? "bg-[var(--highlight-bg)] text-[var(--highlight-text)]" : "hover:bg-[var(--highlight-bg)] hover:text-[var(--highlight-text)]"}`}>
          <div className="flex justify-center">
            <FontAwesomeIcon icon={faGear} size="xl" />
          </div>
          <h1 className="opacity-0 group-hover:opacity-100 transition-all duration-200">Settings</h1>
        </div>
      </div>
    </>
  );
}