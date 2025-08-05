import { ScaleLoader } from "react-spinners";

interface LoadingBarProps {
  color: string;
}

export const LoadingBar = ({ color }: LoadingBarProps) => {
  return (
    <div className="inline-block relative bottom-1 h-4">
      <ScaleLoader
        color={color}
        height={20}
        width={2}
        margin={1}
        radius={10}
      />
    </div>
  );
}