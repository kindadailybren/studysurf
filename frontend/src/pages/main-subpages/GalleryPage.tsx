import { VideoThumbnail } from "../../components/VideoThumnail";

export const GalleryPage = () => {
  return (
    <>
      <div className="flex justify-center flex-1 p-10">
        <div className="grid grid-cols-3 gap-3 max-w-250 md:grid-cols-6">
          <VideoThumbnail/>
          <VideoThumbnail/>
          <VideoThumbnail/>
          <VideoThumbnail/>
          <VideoThumbnail/>
          <VideoThumbnail/>
        </div>
      </div>
    </>
  );
}
