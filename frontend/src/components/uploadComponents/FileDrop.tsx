import { useDropzone } from "react-dropzone"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileImport } from "@fortawesome/free-solid-svg-icons"

interface FileDropProps {
  file: File[];
  setFile: (file: File[]) => void;
  setData: (data: { answer: string }) => void;
}

export const FileDrop = ({ file, setFile, setData, }: FileDropProps) => {
  const onDrop = async (acceptedFiles: File[]) => {
    setFile(acceptedFiles)
  }

  const clearFile = () => {
    setFile([])
    setData({ answer: "No video selected" })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <>
      <h1 className="text-2xl pb-3">Upload File:</h1>
      {isDragActive ? (

        // File Hovering---------------------------------------------------------------
        <div {...getRootProps()} className="w-full h-1/6">
          <input {...getInputProps()} className="hidden" />
          <div className="flex flex-col justify-center border-dashed border-2 rounded-xl w-full h-full gap-2 bg-[#252525] duration-300">
            <FontAwesomeIcon icon={faFileImport} size="xl" style={{ color: "#3b94dc" }} />
            <p className="text-center">Drop the file here ...</p>
          </div>
        </div>
      ) : (
        file && file.length === 1 ? (

          // Successful Drop---------------------------------------------------------------
          <ul>
            <li className="relative text-center border border-[var(--primary-border)] rounded-md p-4 w-fit" key={file[0].name}>
              <button onClick={clearFile} className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-sm w-fit" aria-label="Remove file">
                ✕
              </button>
              {file[0].name}
            </li>
          </ul>
        ) : file.length > 1 ? (

          // Multiple File Drop Error---------------------------------------------------------------
          <>
            <div {...getRootProps()} className="w-full h-1/6">
              <input {...getInputProps()} className="hidden" />
              <div className="flex flex-col justify-center border-dashed border-2 rounded-xl w-full h-full gap-2 bg-[#151515]">
                <FontAwesomeIcon icon={faFileImport} size="xl" style={{ color: "#3b94dc" }} />
                <p className="text-center text-red-500">Only one file allowed</p>
              </div>
            </div>
          </>
        ) : (

          // Default Dropzone---------------------------------------------------------------
          <>
            <div {...getRootProps()} className="w-full h-1/6">
              <input {...getInputProps()} className="hidden" />
              <div className="flex flex-col justify-center border-dashed border-2 rounded-xl w-full h-full gap-2 bg-[#151515]">
                <FontAwesomeIcon icon={faFileImport} size="xl" style={{ color: "#3b94dc" }} />
                <p className="text-center">Drag and drop a file here<br />or click to select one</p>
              </div>
            </div>
          </>
        )
      )}
    </>
  )
}
