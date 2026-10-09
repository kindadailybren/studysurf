import React from "react";
import { User } from "../../components/User";
import { useAuthStore } from "../../stores/authStore";
import { useLoginModalStore } from "../../stores/loginModalStore";
import { DeleteUserButton } from "../../components/DeleteUserButton";
import { LogoutUserButton } from "../../components/LogoutUserButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

export const SettingsPage: React.FC = () => {
  const username = useAuthStore((state) => state.username);
  const setIsOpenSignIn = useLoginModalStore((state) => state.setIsOpenSignIn);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 md:px-12 w-full max-w-4xl mx-auto text-left">
      {/* Header */}
      <div className="mb-8 border-b border-[var(--primary-border)] pb-6">
        <h1 className="text-3xl font-extrabold text-gray-100">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage your account credentials, preferences, and session security.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Profile Card */}
        <div className="bg-[var(--secondary-bg)] border border-[var(--primary-border)] rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4 pb-6 border-b border-white/5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-600 to-[var(--highlight-text)] text-black font-extrabold text-2xl flex items-center justify-center flex-shrink-0 shadow-md">
              {username ? username.charAt(0).toUpperCase() : "?"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-100">
                {username ? username : "Guest User"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {username ? "StudySurf Standard Tier" : "Not authenticated"}
              </p>
              {!username && (
                <button
                  onClick={() => setIsOpenSignIn(true)}
                  className="mt-2 text-xs font-semibold text-[var(--highlight-text)] hover:underline"
                >
                  Sign in or create account →
                </button>
              )}
            </div>
          </div>

          <div className="pt-4">
            <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 max-w-sm">
              <span className="text-xs text-gray-400">Account Status</span>
              <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <FontAwesomeIcon icon={faCircleCheck} />{" "}
                {username ? "Active & Verified" : "Guest Mode"}
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone / Session Management */}
        {username && (
          <div className="bg-[var(--secondary-bg)] border border-red-500/20 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faShieldHalved} className="text-red-400" />
              <h3 className="font-bold text-red-200 text-base">Account Security</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Sign out of your active session or permanently delete your account and associated study videos.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <LogoutUserButton />
              <DeleteUserButton />
            </div>
          </div>
        )}
      </div>

      {/* Hidden legacy login modals container */}
      <div className="hidden">
        <User />
      </div>
    </div>
  );
};
