import { useState, useCallback } from "react"
import '../../App.css'
import { useDropzone } from "react-dropzone"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faCloudArrowUp, faPhotoFilm, faFileImport } from "@fortawesome/free-solid-svg-icons"

export const FileUpload = () => {
  const [files, setFiles] = useState<[]>([])

  const onDrop = useCallback(acceptedFiles => {
      setFiles(acceptedFiles)
  }, [])

  const clearFiles = () => {
    setFiles([])
  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  return(
    <>
      <h1 className="text-2xl pb-3">Upload File:</h1>
        {isDragActive ? (
      <div {...getRootProps()} className="w-full h-1/6">
        <input {...getInputProps()} className="hidden" />
          <div className="flex flex-col justify-center border border-dashed border-2 rounded-xl w-full h-full gap-2 bg-[#252525] duration-300">
            <FontAwesomeIcon icon={faFileImport} size="xl" style={{ color: "#3b94dc" }} />
            <p className="text-center">Drop the file here ...</p>
          </div>
      </div>
        ) : (
              files && files.length === 1 ? (
                <ul>
                  <li
                    className="relative text-center border border-[var(--primary-border)] rounded-md p-4 w-fit"
                    key={files[0].name}
                  >
                    <button
                      onClick={clearFiles}
                      className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-sm w-fit"
                      aria-label="Remove file"
                    >
                      ✕
                    </button>
                    {files[0].name}
                  </li>
                </ul>
              ) : files.length > 1 ? (
                  <>
      <div {...getRootProps()} className="w-full h-1/6">
        <input {...getInputProps()} className="hidden" />
                    <div className="flex flex-col justify-center border border-dashed border-2 rounded-xl w-full h-full gap-2 bg-[#151515]">
                        <FontAwesomeIcon icon={faFileImport} size="xl" style={{ color: "#3b94dc" }} />
                        <p className="text-center text-red-500">Only one file allowed</p>
                    </div>
                    </div>
                  </>
                ) : (
                  <>
      <div {...getRootProps()} className="w-full h-1/6">
        <input {...getInputProps()} className="hidden" />
                    <div className="flex flex-col justify-center border border-dashed border-2 rounded-xl w-full h-full gap-2 bg-[#151515]">
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

export const SelectVideo = () => {
  return(
    <>
      <h1 className="text-2xl py-3">Select Video:</h1>
      <div className="flex flex-col w-full border border-solid h-2/6 rounded-xl">
      </div>
    </>
  )
}

export const VideoSettings = () => {
  return(
    <>
      <h1 className="text-2xl py-3">Video Settings:</h1>
      <div className="flex flex-col w-full border border-solid h-1/3 rounded-xl ">
        <div className="grid grid-cols-3 h-4/5">
          <div className="border m-3 rounded-xl">
            <h1 className="text-xl py-3 px-3">Resolution:</h1>
          </div>
          <div className="border m-3 rounded-xl">
            <h1 className="text-xl py-3 px-3">Aspect Ratio:</h1>
          </div>
          <div className="border m-3 rounded-xl">
            <h1 className="text-xl py-3 px-3">Quality:</h1>
          </div>
        </div>
        <button className="bg-[var(--highlight-text)] duration-300 hover:bg-blue-600 text-white font-bold py-2 px-4 mx-4 text-s rounded-xl w-fit">
          Generate Video
        </button>
      </div>
    </>
  )
}
