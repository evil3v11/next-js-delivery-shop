"use client";

import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

import { CharCount } from "../../_types/charCount";
import { CategoryFormField, CategoryFormProps } from "../_types";

import CategoryImageSection from "../../_components/ImageSection";
import CategoryFormFields from "./CategoryFormFields";
import CategorySubmitSection from "./CategorySubmitSection";

const CategoryForm = ({
  errors,
  onGenerateSlug,
  onSaveImageFile,
  onRemoveImage,
  onSubmit,
  onCancel,
}: CategoryFormProps) => {
  const { formData, updateFormField } = useArticleCategoriesStore();

  const charCount: CharCount = {
    name: formData.name.length,
    slug: formData.slug.length,
    description: formData.description.length,
    keywords: formData.keywords.length,
    imageAlt: formData.imageAlt.length,
  };

  const handleInputChange = (
    field: CategoryFormField,
    value: string,
    maxLength: number,
  ): void => {
    if (value.length <= maxLength) updateFormField(field, value);
  };

  const handleGenerateSlug = () => onGenerateSlug();

  return (
    <div className="mb-8 bg-white rounded shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Создание новой категории</h2>
      <form onSubmit={onSubmit}>
        <CategoryImageSection
          type="category"
          errors={errors}
          charCount={charCount}
          onInputChange={handleInputChange}
          onRemoveImage={onRemoveImage}
          onSaveImageFile={onSaveImageFile}
        />
        <CategoryFormFields
          errors={errors}
          charCount={charCount}
          onInputChange={handleInputChange}
          onGenerateSlug={handleGenerateSlug}
        />
        <CategorySubmitSection onCancel={onCancel} />
      </form>
    </div>
  );
};

export default CategoryForm;
