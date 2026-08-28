interface CustomColorPickerProps {
  type: "text" | "bg";
  customColor: string;
  handleCustomColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCustomColor: (customColor: string) => void;
  applyCustomColor: () => void;
}

const CustomColorPicker = ({
  type,
  customColor,
  handleCustomColorChange,
  setCustomColor,
  applyCustomColor,
}: CustomColorPickerProps) => (
  <div className="mb-3">
    <div className="text-xs text-gray-600 mb-1">Пользовательский цвет:</div>
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-x-1">
        <input
          type="color"
          title={
            type === "text" ? "Выберите цвет текста" : "Выберите цвет фона"
          }
          value={customColor}
          onChange={handleCustomColorChange}
          className="w-8 h-8 cursor-pointer rounded border border-gray-300"
        />
        <input
          placeholder={type === "text" ? "#000000" : "#ffffff"}
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
        />
      </div>
      <button
        type="button"
        onClick={applyCustomColor}
        className="w-full px-2 py-1 text-sm bg-[#9674F9] text-white rounded hover:bg-[#8563e8] duration-300 cursor-pointer"
      >
        Применить
      </button>
    </div>
  </div>
);

export default CustomColorPicker;
