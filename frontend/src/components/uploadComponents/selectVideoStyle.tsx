interface SelectVideoStyleProps {
  data: { answer: string }
}

export const SelectVideoStyle = ({ data }: SelectVideoStyleProps) => {
  return (
    <>
      <h1 className="text-2xl py-3">Select Video:</h1>
      <div className="flex flex-col justify-center text-center w-full border border-solid h-2/6 rounded-xl">
        <h1>Answer: {data.answer}</h1>
      </div>
    </>
  )
}
