import './App.css'
import { useState } from 'react';
import { Sidebar } from './components/Sidebar.tsx'
import { Main } from './components/Main.tsx'


function App() {
  const [activeTab, setActiveTab] = useState<string>("upload");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <>
      <div className="flex text-[var(--primary-text)] h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
        <Main />
      </div>
    </>
  )
}

export default App
