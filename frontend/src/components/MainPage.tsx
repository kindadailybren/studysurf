import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';
import { UploadPage } from './UploadPage.tsx'
import { GalleryPage } from './GalleryPage.tsx';
import { SettingsPage } from './SettingsPage.tsx';
import { NotFoundPage } from './NotFoundPage.tsx';

export const MainPage = () => {
  const [activeTab, setActiveTab] = useState<string>("upload");
	const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
		navigate(`/mp/${tab}`);
  }
		
	return (
    <div className="flex text-[var(--primary-text)] h-screen">
      <Sidebar activeTab={activeTab} changeTab={handleTabChange} />
      <Routes>
        <Route index element={<Navigate to="upload" />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
