"use client";

import { useCallback, useRef, useState } from "react";

const ImageUploader = ({
  onImageUploadAction,
  maxSize = 5 * 1024 * 1024, // i.e. 5 MB
}: {
  onImageUploadAction: (file: File) => void;
  maxSize?: number;
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToJpeg = useCallback(async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Ошибка конвертации"));
            resolve(
              new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                type: "image/jpeg",
              }),
            );
          },
          "image/jpeg",
          0.9,
        );
      };

      img.onerror = () => reject(new Error("Ошибка загрузки изображения"));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleFile = useCallback(
    async (file: File): Promise<void> => {
      const allowedType = ["image/jpeg","image/jpg","image/png","image/webp","image/gif","image/avif"];

      if (!allowedType.includes(file.type)) {
        setError("Разрешены только изображения (.jpg, .png, .webp, .gif, .avif)");
        return;
      }

      if (file.size > maxSize) {
        setError(`Файл слишком большой. Возможно загрузить только файл размером не более, чем ${maxSize / 1024 / 1024} МБ`);
        return;
      }

      try {
        setIsConverting(true);
        setError("");

        const finalFile = file.type.includes("image/jpeg") ? file : await convertToJpeg(file);
        onImageUploadAction(finalFile);
      } catch {
        setError("Ошибка при обработке изображения");
      } finally {
        setIsConverting(false);
      }
    },

    [maxSize, onImageUploadAction, convertToJpeg],
  );

  // upload image using drag & drop
  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragging(false);
    const img = e.dataTransfer?.files[0];
    if (img) handleFile(img);
  };

  // upload image using manual upload (fs)
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => e.target.files?.[0] ? handleFile(e.target.files[0]) : "";

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer duration-300 ${
          isDragging
            ? "border-primary bg-[#e5ffde]"
            : "border-gray-300 hover:border-gray-400"
        } ${isConverting ? "opacity-50 cursor-not-allowed" : ""}`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onClick={isConverting ? undefined : () => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="space-y-2">
          {isConverting ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          ) : (
            <svg
              className="w-12 h-12 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          )}
          <p className="text-sm text-gray-600">
            {isConverting ? (
              "Конвертация в JPG..."
            ) : (
              <>
                Перетащите изображение или{" "}
                <span className="font-medium text-primary hover:text-[#008c49] duration-300">
                  выберите файл
                </span>
              </>
            )}
          </p>
          <p className="text-xs text-gray-500">
            {isConverting
              ? "Пожалуйста, подождите"
              : `.jpg, .png, .webp, .gif, .avif до ${maxSize / 1024 / 1024} MB`}
          </p>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ImageUploader;
