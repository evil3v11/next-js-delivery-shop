"use client";

import { useRef } from "react";
import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";
import { useArticleStore } from "@/store/articleStore";

import { SEO_LIMITS } from "../_utils/SEO_LIMITS";

import { ImageSectionProps } from "../_types/imageSection";

import { AlertCircle, Upload, XCircle } from "lucide-react";
import Image from "next/image";

const ImageSection = ({
  type,
  errors = {},
  charCount,
  onInputChange,
  onRemoveImage,
  onSaveImageFile,
}: ImageSectionProps) => {
  const categoryData = useArticleCategoriesStore();
  const articleData = useArticleStore();
  const storeData = type === "category" ? categoryData : articleData;

  const { formData, editingId, isUploading, isSubmitting, setIsUploading } = storeData;

  const entityName = type === "category" ? "категории" : "статьи";

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Размер файла не должен превышать 5 МБ");
      return;
    }

    try {
      setIsUploading(true);
      onSaveImageFile(file);
    } catch (e) {
      console.error("Ошибка при выборе изображения: ", e);
      alert("Ошибка при выборе изображения");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (): void => {
    onRemoveImage();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mb-6 bg-gray-50 p-4 rounded border border-gray-200">
      <h3 className="text-lg font-medium mb-4">Изображение {entityName}</h3>
      <div className="space-y-4">
        {formData.image && (
          <div className="bg-white p-4 rounded border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <Image
                  src={formData.image}
                  alt="Предпросмотр"
                  width={800}
                  height={450}
                  unoptimized={formData.image.startsWith("blob:")}
                  className="w-200 h-112.5 object-contain rounded shadow-sm"
                />
              </div>
            </div>
            <div className="flex-1 mt-8">
              <p className="text-sm text-gray-600 mb-2">
                {formData.image.startsWith("blob:")
                  ? "Новое изображение (будет загружено при сохранении)"
                  : `Текущее изображение ${entityName}`}
              </p>
              {formData.image.startsWith("blob:") && (
                <p className="flex items-center gap-1 text-xs text-green-600 mb-2">
                  <AlertCircle className="w-3 h-3" />
                  Старое изображение будет удалено после сохранения
                </p>
              )}
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isUploading || isSubmitting}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded 
                hover:bg-red-100 cursor-pointer duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                border border-red-200 hover:border-red-300"
              >
                <XCircle className="w-4 h-4" />
                Удалить изображение
              </button>
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2">
            {formData.image ? "Заменить изображение" : "Загрузить изображение"}
            <span className="text-gray-500 text-xs ml-2">
              (рекомендуется 800×450px, максимум 5MB)
            </span>
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/avif"
                  onChange={handleFileChange}
                  disabled={isUploading || isSubmitting}
                  className="hidden"
                />
                <div
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus-within:border-primary 
                focus-within:ring-3 focus-within:ring-primary/20 duration-300 disabled:opacity-50 disabled:bg-gray-100 
                bg-white hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2 text-gray-700">
                    <Upload className="w-4 h-4" />
                    <span>Выберите файл</span>
                  </div>
                </div>
              </label>
            </div>
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent" />
                Обработка...
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Поддерживаемые форматы: JPG, PNG, GIF, WebP. Изображение будет
            загружено на сервер только при сохранении {entityName}.
            {editingId &&
              formData.image &&
              formData.image.startsWith("blob:") && (
                <span className="flex items-center gap-1 text-red-600 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  При сохранении старое изображение будет удалено
                </span>
              )}
          </p>
        </div>
        {formData.image && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">
                Описание изображения (ALT текст)
              </label>
              <span
                className={`text-xs ${
                  charCount.slug > SEO_LIMITS.slug.max
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {charCount.imageAlt}/{SEO_LIMITS.imageAlt.max}
              </span>
            </div>
            <input
              placeholder="Например: Соки и напитки в ассортименте"
              disabled={isSubmitting}
              value={formData.imageAlt || ""}
              onChange={(e) =>
                onInputChange(
                  "imageAlt",
                  e.target.value,
                  SEO_LIMITS.imageAlt.max,
                )
              }
              className={`w-full px-3 py-2.5 bg-white border rounded focus:outline-none focus:ring-3 duration-300 ${
                errors.imageAlt
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-primary focus:ring-primary/20"
              } disabled:opacity-50 disabled:bg-gray-100 placeholder:text-gray-400`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSection;
