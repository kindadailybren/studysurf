import '../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons"

export const Navbar = () => {
  return (
    <>
      <nav className="border-b-1 border-[var(--primary-border)] h-18 flex gap-2 items-center">
        <FontAwesomeIcon className="my-auto mx-[20px]" icon={faBars} size="2xl" style={{color: "#ffffff",}} />
        <img src="/studysurf_final.png" className="h-10"></img>
        <h1 className="text-[#82B6E0] text-4xl font-[Kantumruy] ">StudySurf</h1>
      </nav>
    </>
  )
}

