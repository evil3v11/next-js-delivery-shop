import { Check } from "lucide-react";
import { CSSProperties } from "react";

interface ApplyColorButtonProps {
  type: "text" | "bg";
  color: string;
  title: string;
  style: CSSProperties;
  currentColor: string;
  className: string;
  iconClassName: string;
  onClick: (value: string) => void;
}

const ApplyColorButton = ({
  type,
  color,
  style,
  currentColor,
  className,
  iconClassName,
  onClick,
}: ApplyColorButtonProps) => {
  return (
    <button
      type="button"
      title={color === "transparent" ? "Прозрачный" : color}
      style={style}
      onClick={() => onClick(color)}
      className={className}
    >
      {type === "text" && currentColor === color && (
        <Check className={iconClassName} />
      )}
      {type === "bg" && currentColor === color && color !== "transparent" && (
        <Check className="w-3 h-3 mx-auto text-gray-700 stroke-2 absolute inset-0 m-auto" />
      )}
      {type === "bg" && color === "transparent" && currentColor === color && (
        <Check className="w-3 h-3 mx-auto text-red-500 stroke-2 absolute inset-0 m-auto" />
      )}
      {type === "bg" && color === "transparent" && currentColor !== color && (
        <div className="absolute inset-0 m-auto w-4 h-0.5 bg-red-300 transform rotate-45" />
      )}
    </button>
  );
};

export default ApplyColorButton;
