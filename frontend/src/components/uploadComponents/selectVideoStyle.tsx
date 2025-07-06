interface SelectVideoStyleProps {
  loading: boolean;
  data: { answer: string }
}

export const SelectVideoStyle = ({ loading, data }: SelectVideoStyleProps) => {
  return (
    <>
      <h1 className="text-2xl py-3">Select Video:</h1>
      <div className="flex flex-col justify-center text-center w-full border border-solid h-2/6 rounded-xl">
        {loading ? <h1 className="">Loading...</h1> : <h1 className="">Answer: {data.answer}</h1>}
      </div>
    </>
  )
}
