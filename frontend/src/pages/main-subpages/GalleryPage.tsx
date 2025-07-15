import { VideoThumbnail } from "../../components/VideoThumbnail";

export const GalleryPage = () => {
  
  return (
    <>
      <div className="flex-1 p-10">
        <h1 className=""></h1>
        <div className="flex justify-center gap-5 py-10 h-100">
          <VideoThumbnail/>
          <VideoThumbnail/>
          <VideoThumbnail/>
          <VideoThumbnail/>
        </div>
      </div>
    </>
  );
}
