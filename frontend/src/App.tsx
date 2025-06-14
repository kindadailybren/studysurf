import './App.css'
import { Route, Routes } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { MainPage } from './components/MainPage';
import { NotFoundPage } from './components/NotFoundPage.tsx';

function App() {
  return (
    <>
      <Routes>
				<Route path="/" element={<LandingPage/>}/>
				<Route path="/mp/*" element={<MainPage/>}/>
				<Route path="*" element={<NotFoundPage/>}/>
			</Routes>
    </>
  );
}

export default App
