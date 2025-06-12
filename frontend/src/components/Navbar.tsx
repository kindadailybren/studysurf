import '../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const Navbar = () => {
  return (
    <>
      <nav className="border-b-1 border-[var(--primary-border)] h-18 flex gap-2 items-center">
        <img src="/studysurf_final.png" className="h-10"></img>
        <h1 className="text-[var(--highlight-text)] text-4xl font-[Kantumruy] ">StudySurf</h1>
      </nav>
    </>
  )
}

