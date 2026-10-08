import './styles/App.css'
import { useEffect } from 'react';
import axios from 'axios';
import { api } from './api/Api.ts';
import { useAuthStore } from "./stores/authStore";

import { Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage.tsx';
import { MainPage } from './pages/MainPage';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

import { LoginModals } from './components/LoginModals';

function App() {
  const setAccessTokenStore = useAuthStore((state) => state.setAccessToken);
  const setIdTokenStore = useAuthStore((state) => state.setIdToken);
  const setUsernameStore = useAuthStore((state) => state.setUsername);
  const setIsAuthLoading = useAuthStore((state) => state.setIsAuthLoading);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await api.post('/refreshToken', null);
        const { accessToken, idToken, username } = response.data;

        setAccessTokenStore(accessToken);
        setIdTokenStore(idToken);
        setUsernameStore(username);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Expected when not logged in or cookie expired
        }
      } finally {
        setIsAuthLoading(false);
      }
    };
    refreshToken();
  }, [setAccessTokenStore, setIdTokenStore, setUsernameStore, setIsAuthLoading]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/*" element={<MainPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <LoginModals />
    </>
  );
}

export default App
