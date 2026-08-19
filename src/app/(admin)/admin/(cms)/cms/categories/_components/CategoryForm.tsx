"use client";

import { useRef } from "react";
import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";
import { useScrollModalToBlock } from "@/hooks/useScrollModalToBlock";

import { CategoryFormProps, CharCount } from "../../_types";
import { FormField } from "../../_types/category-form/form/category-form-field";

import CategoryImageSection from "./CategoryImageSection";
import CategoryFormFields from "./CategoryFormFields";
import CategorySubmitSection from "./CategorySubmitSection";

const CategoryForm = ({
  showForm,
  errors,
  onGenerateSlug,
  onSaveImageFile,
  onRemoveImage,
  onSubmit,
  onCancel,
}: CategoryFormProps) => {
  const { formData, updateFormField } = useArticleCategoriesStore();

  const formRef = useRef<HTMLDivElement>(null);
  useScrollModalToBlock(formRef, showForm, "start");

  const charCount: CharCount = {
    name: formData.name.length,
    slug: formData.slug.length,
    description: formData.description.length,
    keywords: formData.keywords.length,
    imageAlt: formData.imageAlt.length,
  };

  const handleInputChange = (
    field: FormField,
    value: string,
    maxLength: number,
  ): void => {
    if (value.length <= maxLength) updateFormField(field, value);
  };

  const handleGenerateSlug = () => onGenerateSlug();

  return (
    <div ref={formRef} className="mb-8 bg-white rounded shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Создание новой категории</h2>
      <form onSubmit={onSubmit}>
        <CategoryImageSection
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
