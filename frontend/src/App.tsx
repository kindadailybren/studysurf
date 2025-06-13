import './App.css'
import { Sidebar } from './components/Sidebar.tsx'
import { Main } from './components/Main.tsx'


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
