import React from "react";
import "../styles/App.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faCloudArrowUp,
  faPhotoFilm,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../stores/authStore";
import { useLoginModalStore } from "../stores/loginModalStore";

interface activeTabType {
  activeTab: string;
  changeTab: (tab: string) => void;
}

export const Sidebar: React.FC<activeTabType> = ({ activeTab, changeTab }) => {
  const username = useAuthStore((state) => state.username);
  const setIsOpenSignIn = useLoginModalStore((state) => state.setIsOpenSignIn);

  return (
    <aside className="group flex flex-col justify-between border-r border-[var(--primary-border)] bg-[var(--secondary-bg)] w-20 hover:w-56 h-screen py-6 px-3 transition-all duration-300 ease-in-out z-20 flex-shrink-0 select-none">
      {/* Top Section: Brand & Nav Items */}
      <div className="flex flex-col gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 px-2 py-2 rounded-xl overflow-hidden">
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
            <img
              src="/studysurf_final.png"
              alt="StudySurf"
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[var(--highlight-text)] text-xl font-bold whitespace-nowrap tracking-tight">
            StudySurf
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5 mt-2">
          <button
            onClick={() => changeTab("upload")}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-150 w-full text-left overflow-hidden ${
              activeTab === "upload"
                ? "bg-[var(--highlight-bg)] text-[var(--highlight-text)] font-semibold"
                : "text-gray-400 hover:bg-white/5 hover:text-gray-100"
            }`}
          >
            <div className="w-6 flex-shrink-0 text-center">
              <FontAwesomeIcon icon={faCloudArrowUp} size="lg" />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap text-sm">
              Create Short
            </span>
          </button>

          <button
            onClick={() => changeTab("gallery")}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-150 w-full text-left overflow-hidden ${
              activeTab === "gallery"
                ? "bg-[var(--highlight-bg)] text-[var(--highlight-text)] font-semibold"
                : "text-gray-400 hover:bg-white/5 hover:text-gray-100"
            }`}
          >
            <div className="w-6 flex-shrink-0 text-center">
              <FontAwesomeIcon icon={faPhotoFilm} size="lg" />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap text-sm">
              Video Gallery
            </span>
          </button>

          <button
            onClick={() => changeTab("settings")}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-150 w-full text-left overflow-hidden ${
              activeTab === "settings"
                ? "bg-[var(--highlight-bg)] text-[var(--highlight-text)] font-semibold"
                : "text-gray-400 hover:bg-white/5 hover:text-gray-100"
            }`}
          >
            <div className="w-6 flex-shrink-0 text-center">
              <FontAwesomeIcon icon={faGear} size="lg" />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap text-sm">
              Settings
            </span>
          </button>
        </nav>
      </div>

      {/* Bottom Section: User Profile Card */}
      <div className="border-t border-[var(--primary-border)] pt-4 overflow-hidden">
        {username ? (
          <button
            onClick={() => changeTab("settings")}
            className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors w-full text-left overflow-hidden"
            title={username}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-[var(--highlight-text)] text-black font-bold flex items-center justify-center flex-shrink-0 shadow-md">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 overflow-hidden leading-tight">
              <p className="text-xs font-semibold text-gray-200 truncate">{username}</p>
              <p className="text-[10px] text-emerald-400 font-medium">Free Plan</p>
            </div>
          </button>
        ) : (
          <button
            onClick={() => setIsOpenSignIn(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-[var(--highlight-text)] hover:text-black text-[var(--highlight-text)] transition-all w-full text-left overflow-hidden cursor-pointer"
          >
            <div className="w-6 flex-shrink-0 text-center">
              <FontAwesomeIcon icon={faRightToBracket} />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-semibold whitespace-nowrap">
              Sign In
            </span>
          </button>
        )}
      </div>
    </aside>
  );
};
