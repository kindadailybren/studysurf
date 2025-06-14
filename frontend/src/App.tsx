import './App.css'
import { Routes, Route } from 'react-router-dom';
import { Upload } from './components/Upload.tsx'
import { LandingPage } from './components/LandingPage.tsx'
import { NotFoundPage } from './components/NotFoundPage.tsx';

function App() {
  return (
    <Routes>
      <Route path="*" element={<NotFoundPage/>}/>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/upload" element={<Upload/>}/>
      <Route path="/gallery" element={<Upload/>}/>
      <Route path="/settings" element={<Upload/>}/>
    </Routes>
  )
}

export default App
