"use client";

import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

import { SEO_LIMITS } from "../../_utils/SEO_LIMITS";

import { CategoryFormFieldsProps } from "../../_types";

import { RotateCcw } from "lucide-react";

const CategoryFormFields = ({
  errors,
  charCount,
  onInputChange,
  onGenerateSlug,
}: CategoryFormFieldsProps) => {
  const { formData, isSubmitting } = useArticleCategoriesStore();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Название категории *
          </label>
          <span
            className={`text-xs ${
              charCount.name > SEO_LIMITS.name.max
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {charCount.name}/{SEO_LIMITS.name.max}
          </span>
        </div>
        <input
          required
          disabled={isSubmitting}
          placeholder="Например: Соки"
          value={formData.name}
          onChange={(e) =>
            onInputChange("name", e.target.value, SEO_LIMITS.name.max)
          }
          className={`w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 ${
            errors.name
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-gray-300 focus:border-primary focus:ring-primary/20"
          } disabled:opacity-50 disabled:bg-gray-100 placeholder:text-gray-400`}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Алиас (slug) *
          </label>
          <span
            className={`text-xs ${
              charCount.slug > SEO_LIMITS.slug.max
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {charCount.slug}/{SEO_LIMITS.slug.max}
          </span>
        </div>
        <div className="flex gap-2">
          <input
            required
            placeholder="soki"
            disabled={isSubmitting}
            value={formData.slug}
            onChange={(e) => {
              const value = e.target.value.toLowerCase();
              const cleaned = value
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
              onInputChange("slug", cleaned, SEO_LIMITS.slug.max);
            }}
            className={`flex-1 px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 ${
              errors.slug
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-gray-300 focus:border-primary focus:ring-primary/20"
            } disabled:opacity-50 disabled:bg-gray-100 placeholder:text-gray-400`}
          />
          <button
            type="button"
            title="Сгенерировать из названия"
            onClick={onGenerateSlug}
            className="flex items-center gap-1 px-4 py-2.5 bg-gray-50 text-gray-700 rounded 
            hover:bg-gray-100 text-sm whitespace-nowrap cursor-pointer duration-200 disabled:opacity-50 
            disabled:cursor-not-allowed border border-gray-300 hover:border-gray-400 focus:outline-none 
            focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
          >
            <RotateCcw className="w-4 h-4" />
            Генерировать
          </button>
        </div>
        {errors.slug ? (
          <p className="text-red-500 text-xs mt-1">{errors.slug}</p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            Только латиница, цифры и дефисы
          </p>
        )}
      </div>
      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Описание (мета-описание)
          </label>
          <span
            className={`text-xs ${
              charCount.description > SEO_LIMITS.description.max
                ? "text-red-600"
                : charCount.description < SEO_LIMITS.description.min &&
                    charCount.description > 0
                  ? "text-yellow-600"
                  : "text-gray-500"
            }`}
          >
            {charCount.description}/{SEO_LIMITS.description.max}
          </span>
        </div>
        <textarea
          rows={3}
          placeholder="Краткое описание категории для поисковых систем (10-160 символов)"
          disabled={isSubmitting}
          value={formData.description}
          onChange={(e) =>
            onInputChange(
              "description",
              e.target.value,
              SEO_LIMITS.description.max,
            )
          }
          className={`w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 resize-none ${
            errors.description
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-gray-300 focus:border-primary focus:ring-primary/20"
          } disabled:opacity-50 disabled:bg-gray-100 placeholder:text-gray-400`}
        />
        {errors.description ? (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            Оптимальная длина для SEO: {SEO_LIMITS.description.min}-
            {SEO_LIMITS.description.max} символов
          </p>
        )}
      </div>
      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Ключевые слова
            <span className="text-gray-500 text-xs ml-2">(через запятую)</span>
          </label>
          <span
            className={`text-xs ${
              charCount.keywords > SEO_LIMITS.keywords.maxLength
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {charCount.keywords}/{SEO_LIMITS.keywords.maxLength}
          </span>
        </div>
        <input
          placeholder="мясо, напитки, польза и вред"
          disabled={isSubmitting}
          value={formData.keywords}
          onChange={(e) =>
            onInputChange(
              "keywords",
              e.target.value,
              SEO_LIMITS.keywords.maxLength,
            )
          }
          className={`w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 ${
            errors.keywords
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-gray-300 focus:border-primary focus:ring-primary/20"
          } disabled:opacity-50 disabled:bg-gray-100 placeholder:text-gray-400`}
        />
        {errors.keywords && (
          <p className="text-red-500 text-xs mt-1">{errors.keywords}</p>
        )}
      </div>
    </div>
  );
};

export default CategoryFormFields;
