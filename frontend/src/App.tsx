import './styles/App.css'
import { Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage.tsx';
import { MainPage } from './pages/MainPage';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/*" element={<MainPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App
