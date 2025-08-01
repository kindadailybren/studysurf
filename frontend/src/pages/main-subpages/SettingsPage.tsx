import { User } from "../../components/User";
import { useAuthStore } from "../../stores/authStore";

import { DeleteUserButton } from "../../components/DeleteUserButton";
import { LogoutUserButton } from "../../components/LogoutUserButton";

export const SettingsPage = () => {
  const username = useAuthStore((state) => state.username);

  return (
    <>
      <div className="flex-1 items-center justify-center border-[var(--primary-border)] w-full h-screen mb-10 p-10">

        <h1 className="text-3xl font-semibold">Settings Page</h1>
        <User/>
        {username && 
          <>
            <DeleteUserButton/>
            <LogoutUserButton/>
          </>
        }
      </div>
    </>
  );
}
