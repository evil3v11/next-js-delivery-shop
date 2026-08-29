import { aspectRatios } from "../../_utils/aspectRatios";
import { promptStyles } from "../../_utils/promptStyles";

import { AspectRatio, ImageStyle, SettingsPanelProps } from "../../../_types";

const MenuSettingsPanel = ({
  isGenerating,
  selectedAspect,
  selectedStyle,
  onAspectChange,
  onStyleChange,
}: SettingsPanelProps) => {
  const handleAspectClick = (e: React.MouseEvent, ratio: AspectRatio) => onAspectChange(ratio);
  const handleStyleClick = (e: React.MouseEvent, style: ImageStyle) => onStyleChange(style);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Формат изображения:
        </label>
        <div className="grid grid-cols-4 gap-2 align-middle">
          {aspectRatios.map((ratio) => (
            <button
              type="button"
              key={ratio.id}
              onClick={(e) => handleAspectClick(e, ratio.id)}
              title={`${ratio.label} (${ratio.desc})`}
              disabled={isGenerating}
              className={`p-3 md:h-20 rounded-lg border flex flex-col items-center duration-300 gap-1 cursor-pointer ${
                selectedAspect === ratio.id
                  ? "bg-red-50 border-red-300 text-red-700"
                  : "hover:bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <span className="text-xl mb-1">{ratio.icon}</span>
              <span className="text-xs">{ratio.id}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Стиль изображения:
        </label>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {promptStyles.map((style) => (
            <button
              type="button"
              key={style.id}
              onClick={(e) => handleStyleClick(e, style.id)}
              disabled={isGenerating}
              title={style.label}
              className={`p-3 md:h-20 rounded-lg border flex flex-col items-center gap-1 duration-300 cursor-pointer ${
                selectedStyle === style.id
                  ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                  : "hover:bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <span className={style.color}>{style.icon}</span>
              <span className="text-xs">{style.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuSettingsPanel;
