"use client";

import { useArticleStore } from "@/store/articleStore";
import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

import { CharCount } from "../../../_types/charCount";
import { ArticleFormField, ArticleFormProps } from "../../_types";

import ImageSection from "../../../_components/ImageSection";
import ArticleFormFields from "./ArticleFormFields";
import CategorySelect from "./CategorySelect";
import ArticleSubmitSection from "./ArticleSubmitSection";
import TiptapEditor from "../tiptap-components/TiptapEditor";

const ArticleForm = ({
  onGenerateSlug,
  onSaveImageFile,
  onRemoveImage,
  onSubmit,
  onCancel,
}: ArticleFormProps) => {
  const { formData, updateFormField } = useArticleStore();
  const { categories } = useArticleCategoriesStore();

  const charCount: CharCount = {
    name: formData.name.length,
    slug: formData.slug.length,
    description: formData.description.length,
    keywords: formData.keywords.length,
    imageAlt: formData.imageAlt.length,
  };

  const handleInputChange = (
    field: ArticleFormField,
    value: string,
    maxLength?: number,
  ): void => {
    if (value.length <= maxLength!) updateFormField(field, value);
    if (field === 'content') updateFormField(field, value)
  };

  const handleGenerateSlug = () => onGenerateSlug();

  const handleCategoryChange = (
    id: string,
    name: string,
    slug: string,
  ): void => {
    updateFormField("categoryId", id);
    updateFormField("categoryName", name);
    updateFormField("categorySlug", slug);
  };

  return (
    <div className="mb-8 bg-white rounded shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Создание новой статьи</h2>
      <form onSubmit={onSubmit}>
        <ImageSection
          type="article"
          charCount={charCount}
          onInputChange={handleInputChange}
          onRemoveImage={onRemoveImage}
          onSaveImageFile={onSaveImageFile}
        />
        {categories.length > 0 && (
          <div className="mb-6 bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Категория статьи *</h3>
            <CategorySelect
              value={formData.categoryId || ""}
              onChange={handleCategoryChange}
            />
          </div>
        )}
        <ArticleFormFields
          charCount={charCount}
          onInputChange={handleInputChange}
          onGenerateSlug={handleGenerateSlug}
        />
        <div className="my-6 bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Текст статьи *</h3>
          <TiptapEditor
            key={formData._id || "new-article"}
            content={formData.content || ""}
            onContentChange={(content) => handleInputChange("content", content)}
          />
        </div>
        <ArticleSubmitSection onCancel={onCancel} />
      </form>
    </div>
  );
};

export default ArticleForm;
