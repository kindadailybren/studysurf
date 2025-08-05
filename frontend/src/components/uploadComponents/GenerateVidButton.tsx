import { api } from "../../api/Api.ts"

interface GenVidButtonProps {
  file: File[];
  setLoading: (state: boolean) => void;
  setData: (data: { answer: string }) => void;
}

export const GenVidButton = ({ file, setLoading, setData }: GenVidButtonProps) => {
  const videoUpload = async () => {
    if (!file[0]) return;

    setLoading(true);

    try {
      const response = await api.post("/genvid", file[0], {
        headers: {
          "Content-Type": "application/pdf",
        },
      });
      setData(response.data);
    } catch (error) {
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={videoUpload} className="cursor-pointer bg-[var(--highlight-text)] duration-300 hover:bg-blue-600 text-white font-bold py-2 px-4 mx-4 text-s rounded-xl w-fit my-4">
        Generate Video
      </button>
    </>
  )

}
