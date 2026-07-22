import { RotateCw } from "lucide-react";

const LoadingContent = ({ title }: { title: string | React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 p-5">
      <div className="relative">
        <RotateCw className="h-10 w-10 text-secondary animate-spin" />
        <div
          className="absolute inset-0 rounded-full border-2 border-secondary border-opacity-20
          animate-ping"
        />
      </div>
      <div className="text-center text-main-text space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p>Пожалуйста, подождите...</p>
      </div>
    </div>
  );
};

export default LoadingContent;
