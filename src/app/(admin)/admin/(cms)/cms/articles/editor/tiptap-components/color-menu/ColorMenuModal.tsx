import ApplyColorButton from "./ApplyColorButton";
import ResetColorButton from "./ResetColorButton";
import CurrentColorShowcase from "./CurrentColorShowcase";
import CustomColorPicker from "./CustomColorPicker";

interface ColorMenuModalProps {
  type: "bg" | "text";
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  colors: string[];
  currentColor: string;
  customColor: string;
  handleApplyColor: (color: string) => void;
  setCustomColor: (color: string) => void;
  handleCustomColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  applyCustomColor: () => void;
  resetColor: () => void;
}

const ColorMenuModal = ({
  type,
  dropdownRef,
  colors,
  currentColor,
  customColor,
  handleApplyColor,
  setCustomColor,
  handleCustomColorChange,
  applyCustomColor,
  resetColor,
}: ColorMenuModalProps) => (
  <div
    ref={dropdownRef}
    onClick={(e) => e.stopPropagation()}
    className="absolute z-50 mt-1 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-2 max-w-[calc(100vw-20px)]"
    style={{
      left: "50%",
      transform: "translateX(-50%)",
      maxHeight: "calc(100vh - 100px)",
      overflowY: "auto",
    }}
  >
    <div className="mb-3">
      <div className="text-xs font-medium text-gray-700 mb-2">
        Цвет {type === "bg" ? "фона" : "текста"}
      </div>
      <div className="grid grid-cols-6 gap-1 mb-2">
        {colors.map((color: string) => {
          const applyColorBtnClassName = `w-5 h-5 rounded border border-gray-300 hover:scale-110 transition-transform relative duration-300 cursor-pointer ${color === "#000000" ? "border-2" : "border border-gray-300"}`;
          const applyColorBtnIconClassName = `w-2.5 h-2.5 mx-auto stroke-2 absolute inset-0 m-auto ${color === "#000000" || color === "#000080" || color === "#800000" ? "text-white" : "text-gray-700"}`;
          const applyColorBtnStyle = type === "text"
            ? { backgroundColor: color }
            : {
                backgroundColor: color === "transparent" ? "#fff" : color,
                backgroundSize: color === "transparent" ? "8px 8px" : "auto",
                backgroundImage: color === "transparent"
                  ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                  : "none",
              };

          return (
            <ApplyColorButton
              key={color}
              type={type}
              color={color}
              currentColor={currentColor}
              onClick={handleApplyColor}
              title={color === "transparent" ? "Прозрачный" : color}
              style={applyColorBtnStyle}
              className={applyColorBtnClassName}
              iconClassName={applyColorBtnIconClassName}
            />
          );
        })}
      </div>
      <CustomColorPicker
        type={type}
        customColor={customColor}
        setCustomColor={setCustomColor}
        handleCustomColorChange={handleCustomColorChange}
        applyCustomColor={applyCustomColor}
      />
      <CurrentColorShowcase type={type} currentColor={currentColor} />
    </div>
    <ResetColorButton resetColor={resetColor} />
  </div>
);

export default ColorMenuModal;
