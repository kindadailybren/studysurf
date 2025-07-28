import { User } from "../../components/User";
import { useAuthStore } from "../../stores/authStore";
import { api } from "../../api/LoginApi";
import { useState } from "react";
import { LoadingBar } from "../../components/LoadingBar";

export const SettingsPage = () => {
  const username = useAuthStore((state) => state.username);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const logoutUser = async () => {
    try {
      setLoading(true);
      await api.post('/logout', null, {
        params: {accessToken}
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }

  const deleteUser = async () => {
    try {
      setLoading(true);
      await api.post('/logout', { username, accessCode: accessToken })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex-1 items-center justify-center border-[var(--primary-border)] w-full h-screen mb-10 p-10">

        <h1 className="text-3xl font-semibold">Settings Page</h1>
        <User/>
        {username && 
        <>
          <button onClick={logoutUser} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="border px-5 py-2 mt-2 rounded-lg font-semibold transition-all duration-150 group text-[var(--highlight-text)] hover:bg-[var(--highlight-text)] cursor-pointer hover:text-[var(--secondary-bg)]">
            {loading ? 
              <div className="flex items-center gap-2">
                Logout
                <LoadingBar color={isHovered ? "var(--secondary-bg)" : "var(--highlight-text)"} />
              </div>
            : 
              "Logout"
            }
          </button>
          <button onClick={deleteUser} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="border px-5 py-2 mt-2 rounded-lg font-semibold transition-all duration-150 group text-[var(--highlight-text)] hover:bg-[var(--highlight-text)] cursor-pointer hover:text-[var(--secondary-bg)]">
            {loading ? 
              <div className="flex items-center gap-2">
                Logout
                <LoadingBar color={isHovered ? "var(--secondary-bg)" : "var(--highlight-text)"} />
              </div>
            : 
              "Delete Account"
            }
          </button>
        </>
        }
      </div>
    </>
  );
}
