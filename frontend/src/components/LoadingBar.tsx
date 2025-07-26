import { ScaleLoader } from "react-spinners";

export const LoadingBar = () => {
  return (
    <div className="inline-block relative bottom-1 h-4">
      <ScaleLoader
        color="#3B94DC"
        height={20}
        width={2}
        margin={1}
        radius={10}
      />
    </div>
  );
}