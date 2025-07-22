import { SignUpModal } from "../../components/loginModals/SignUpModal";
import { SignInModal } from "../../components/loginModals/SignInModal";
import { NewPassModal } from "../../components/loginModals/NewPassModal";

export const SettingsPage = () => {
  return (
    <>
      <div className="flex-1 items-center justify-center border-[var(--primary-border)] w-full h-screen mb-10 p-10">

        <h1 className="text-3xl font-semibold">Settings Page</h1>
        <SignUpModal/><br/>
        <SignInModal/><br/>
        <NewPassModal/>
      </div>
    </>
  );
}
