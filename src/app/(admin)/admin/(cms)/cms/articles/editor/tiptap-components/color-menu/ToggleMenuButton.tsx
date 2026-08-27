import { Highlighter, Palette } from "lucide-react";

interface ToggleMenuButtonProps {
  type: "text" | "bg";
  title: string;
  currentColor: string;
  isMenuOpen: boolean;
  isActive: boolean;
  handleMenuToggle: () => void;
}

const ToggleMenuButton = ({
  type,
  title,
  currentColor,
  isMenuOpen,
  isActive,
  handleMenuToggle,
}: ToggleMenuButtonProps) => {
  const style =
    type === "text"
      ? { backgroundColor: currentColor }
      : {
          backgroundColor: currentColor === "transparent" ? "#fff" : currentColor,
          backgroundSize: currentColor === "transparent" ? "8px 8px" : "auto",
          backgroundImage: currentColor === "transparent"
            ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
            : "none",
        };

  const className = ` p-2 rounded duration-300 border cursor-pointer ${
    isMenuOpen
      ? "bg-blue-100 text-[#9674F9] border-blue-300"
      : isActive
        ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200 border-blue-300"
        : "text-gray-700 hover:bg-gray-100 border-gray-300"
  }`;

  return (
    <button
      type="button"
      title={title}
      onClick={handleMenuToggle}
      className={className}
    >
      <div className="flex items-center gap-1">
        {type === "text" ? (
          <Palette className="w-4 h-4" />
        ) : (
          <Highlighter className="w-4 h-4" />
        )}
        <div className="w-3 h-3 rounded border border-gray-300" style={style} />
      </div>
    </button>
  );
};

export default ToggleMenuButton;
