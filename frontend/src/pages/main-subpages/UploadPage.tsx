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
  const SelectVideoStyleProps = { loading, data }
  const GenVidButtonProps = { file, setLoading, setData, username }

  return (
    <>
      <div className="flex-1 items-center justify-center border-[var(--primary-border)] w-full h-screen mb-10 p-10">
        <FileDrop {...FileDropProps} />
        <SelectVideoStyle {...SelectVideoStyleProps} />
        <GenVidButton {...GenVidButtonProps} />
      </div>
    </>
  )
}
