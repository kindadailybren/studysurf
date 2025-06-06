
import '../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faCloudArrowUp, faPhotoFilm } from "@fortawesome/free-solid-svg-icons"

export const Sidebar = () => {
  return (
    <>
      <div className="flex flex-col border-r-4 border-[#3A3A3A] w-50 h-[calc(100vh-93px)] pt-[10px]">
        <div className="flex"><FontAwesomeIcon icon={faCloudArrowUp} size="2xl" style={{color: "#ffffff",}} /><h1 className="text-white text-center">Upload</h1></div>
        <div className="flex"><FontAwesomeIcon icon={faPhotoFilm} size="2xl" style={{color: "#ffffff",}} /><h1 className="text-white">Gallery</h1></div>
        <div className="flex"><FontAwesomeIcon icon={faGear} size="2xl" style={{color: "#ffffff",}} /><h1 className="text-white">Settings</h1></div>
      </div>
    </>
  )
}


export const Main = () => {
  return (
    <>
      <div className="flex items-center justify-center border-r-4 border-[#3A3A3A] w-full h-[calc(100vh-93px)]">
        <div className="h-200 w-4/5 border border-dashed text-center text-white flex items-center justify-center">
          Drag your Study Material Here (PDF, PPT, etc.)
        </div>
      </div>
    </>
  )
}
