import { useAuthStore } from "../stores/authStore";
import { api } from "../api/Api";
import { useState } from "react";
import { LoadingBar } from "../components/LoadingBar";

export const DeleteUserButton = () => {
  const username = useAuthStore((state) => state.username);
  const accessToken = useAuthStore((state) => state.accessToken);
  
  const setAccessTokenStore = useAuthStore((state) => state.setAccessToken);
  const setIdTokenStore = useAuthStore((state) => state.setIdToken);
  const setUsernameStore = useAuthStore((state) => state.setUsername);

  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const deleteUser = async () => {
    try {
      setLoading(true);
      setAccessTokenStore('');
      setIdTokenStore('');
      setUsernameStore('');
      await api.post('/deleteUser', { username, accessCode: accessToken })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={deleteUser} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="border px-5 py-2 mt-2 rounded-lg font-semibold transition-all duration-150 group text-[var(--highlight-text)] hover:bg-[var(--highlight-text)] cursor-pointer hover:text-[var(--secondary-bg)]">
        {loading ? 
          <div className="flex items-center gap-2">
            Delete Account
            <LoadingBar color={isHovered ? "var(--secondary-bg)" : "var(--highlight-text)"} />
          </div>
        : 
          "Delete Account"
        }
      </button>
    </>
  );
}
