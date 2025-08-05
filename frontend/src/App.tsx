import './styles/App.css'
import { useEffect } from 'react';
import axios from 'axios';
import { api } from './api/Api.ts';
import { useAuthStore } from "./stores/authStore";

import { Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage.tsx';
import { MainPage } from './pages/MainPage';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

function App() {
  const setAccessTokenStore = useAuthStore((state) => state.setAccessToken);
  const setIdTokenStore = useAuthStore((state) => state.setIdToken);
  const setUsernameStore = useAuthStore((state) => state.setUsername);

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
          console.error("Error status:", error.response?.status);
          console.error("Error body:", error.response?.data);
        } else {
          console.error("Non-Axios error:", error);
        }
      }
    }
    refreshToken();
  }, [setAccessTokenStore, setIdTokenStore, setUsernameStore])

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
