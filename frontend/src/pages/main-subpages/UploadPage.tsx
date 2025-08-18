import { useState } from "react"
import { useAuthStore } from "../../stores/authStore";
import { FileDrop } from "../../components/uploadComponents/FileDrop"
import { SelectVideoStyle } from "../../components/uploadComponents/selectVideoStyle"
import { GenVidButton } from "../../components/uploadComponents/GenerateVidButton"
import '../../styles/App.css'

// Manage states of the uploaded file
export const UploadPage = () => {
  const [file, setFile] = useState<File[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<{ answer: string }>({ answer: "No Answer" })

  const username = useAuthStore((state) => state.username);

  const FileDropProps = { file, setFile, setData }
  const SelectVideoStyleProps = { data }
  const GenVidButtonProps = { file, setLoading, setData, username }

  return (
    <>
      <div className={`flex-1 ${loading ? "flex" : ""} flex-col items-center justify-center border-[var(--primary-border)] w-full h-screen mb-10 p-10`}>{
        loading ?
        <>
          <h1 className="text-xl">Your video is being generated. It will automatically added to your gallery in approximately 9-10 mins.</h1>
          <button onClick={() => setLoading(false)} className="border px-5 py-2 mt-2 rounded-lg font-semibold transition-all duration-150 group text-[var(--highlight-text)] hover:bg-[var(--highlight-text)] cursor-pointer hover:text-[var(--secondary-bg)]">
            Generate New Video
          </button>
        </>
        : 
        <>
          <FileDrop {...FileDropProps} />
          <SelectVideoStyle {...SelectVideoStyleProps} />
          <GenVidButton {...GenVidButtonProps} />
        </>
        }
      </div>
    </>
  )
}