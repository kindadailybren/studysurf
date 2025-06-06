import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navbar } from './components/Navbar.tsx'
import { Sidebar, Main } from './components/Sidebar.tsx'

function App() {
  return (
    <>
      <Navbar />
      <div className="flex"> 
        <Sidebar />
        <Main />
      </div>
    </>
  )
}

export default App
