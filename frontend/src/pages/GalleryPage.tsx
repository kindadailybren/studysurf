import { AuthCognito } from "../auth/authCognito";

export const GalleryPage = () => {
  // temporary lang ang borders
  return (
    <>
      <div className="flex-1 p-10">
        <AuthCognito/>
        <div className="grid grid-cols-4 gap-10 px-20 py-10">
          <div className="border border-amber-50 flex flex-col h-100 p-5 text-center">
            <div className="border border-amber-50 flex-1"></div>
            <h1 className="text-2xl">Title</h1>
            <p>Description</p>
          </div>
          <div className="border border-amber-50 flex flex-col h-100 p-5 text-center">
            <div className="border border-amber-50 flex-1"></div>
            <h1 className="text-2xl">Title</h1>
            <p>Description</p>
          </div>
          <div className="border border-amber-50 flex flex-col h-100 p-5 text-center">
            <div className="border border-amber-50 flex-1"></div>
            <h1 className="text-2xl">Title</h1>
            <p>Description</p>
          </div>
          <div className="border border-amber-50 flex flex-col h-100 p-5 text-center">
            <div className="border border-amber-50 flex-1"></div>
            <h1 className="text-2xl">Title</h1>
            <p>Description</p>
          </div>
        </div>
      </div>
    </>
  );
}
