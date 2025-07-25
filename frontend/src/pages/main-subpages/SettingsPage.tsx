import { Login } from "../../components/Login";

export const SettingsPage = () => {
  return (
    <>
      <div className="flex-1 items-center justify-center border-[var(--primary-border)] w-full h-screen mb-10 p-10">

        <h1 className="text-3xl font-semibold">Settings Page</h1>
        <Login/>
        
      </div>
    </>
  );
}
