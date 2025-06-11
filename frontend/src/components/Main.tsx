import { FileUpload, SelectVideo, VideoSettings } from './sub-components/mainSub.tsx'

export const Main = () => {

  return (
    <>
      <div className="flex-1 items-center justify-center border-[var(--primary-border)] w-full h-screen mb-10 p-10">
        <form className="h-[88%] mb-10">
          <FileUpload/>
          <SelectVideo/>
          <VideoSettings/>
        </form>
      </div>
    </>
  )
}