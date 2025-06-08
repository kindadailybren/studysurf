import { useState, useRef } from 'react'
import './App.css'
import { Navbar } from './components/Navbar.tsx'
import { Sidebar, Main } from './components/Sidebar.tsx'

function App() {
  return (
    <>
      <div className="flex text-[var(--primary-text)] h-screen"> 
        <Sidebar />
        <Main />
      </div>
    </>
  )
}

export default App
