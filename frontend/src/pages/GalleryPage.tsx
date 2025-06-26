import { AuthCognito } from "../auth/authCognito";

export const GalleryPage = () => {
  return (
    <>
      <div className="flex-1 items-center justify-center border-[var(--primary-border)] w-full h-screen mb-10 p-10">
        <AuthCognito />
        <h1 className="text-3xl font-semibold">Gallery Page</h1>
      </div>
    </>
  );
}
