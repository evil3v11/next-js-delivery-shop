import { useCallback, useRef } from "react";

import { ImageMenuProps } from "../../_types";

import { ImagePlus, Upload } from "lucide-react";
import { useEditorImageUpload } from "../_hooks/useEditorImageUpload";

const ImageMenu = ({ editor, onImageDragOverChange }: ImageMenuProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isUploading, uploadFile, insertByUrl } = useEditorImageUpload(editor);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const files = e.target.files;
      if (!files || !files.length) return;

      await uploadFile(files[0]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [uploadFile],
  );

  const handleButtonMouseEnter = (): void => {
    if (onImageDragOverChange) onImageDragOverChange(true);
  };

  const handleButtonMouseLeave = (): void => {
    if (onImageDragOverChange) onImageDragOverChange(false);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 mr-1">Изображения:</span>
      <div
        className="relative group"
        onMouseEnter={handleButtonMouseEnter}
        onMouseLeave={handleButtonMouseLeave}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        <button
          type="button"
          title={isUploading ? "Загрузка..." : "Загрузить изображение"}
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className={`px-1 py-2 rounded duration-300 cursor-pointer flex items-center gap-1 relative ${
            isUploading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-200 text-gray-600"
          }`}
        >
          <Upload className={`w-4 h-4 ${isUploading ? "animate-pulse" : ""}`} />
          {isUploading && <span className="text-xs">...</span>}
        </button>
      </div>
      <button
        type="button"
        onClick={insertByUrl}
        className="p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer text-gray-600"
        title="Вставить по URL"
        disabled={isUploading}
      >
        <ImagePlus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ImageMenu;
