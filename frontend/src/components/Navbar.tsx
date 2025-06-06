import '../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons"

export const Navbar = () => {
  return (
    <>
      <div className="border-b-4 border-[#3A3A3A] h-[93px] pt-[10px]">
        <div className="flex gap-2">
          <FontAwesomeIcon className="mt-[20px] mx-[20px]" icon={faBars} size="2xl" style={{color: "#ffffff",}} />
          <img src="/studysurf_final.png" className="w-17 h-15"></img>
          <h1 className="text-[#82B6E0] text-[48px] font-[Kantumruy] ">StudySurf</h1>
        </div>
      </div>
    </>
  )
}

