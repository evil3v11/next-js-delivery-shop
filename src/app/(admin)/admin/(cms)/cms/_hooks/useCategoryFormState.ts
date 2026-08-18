import { useCallback, useState } from "react";
import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

import { transliterateText } from "@/utils/transliterateText";

import type { Category } from "../_types/entities";

export const useCategoryFormState = () => {
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
  const {
    formData,
    setEditingId,
    clearEditingId,
    setShowForm,
    setOriginalImageUrl,
    setFormData,
    updateFormField,
    resetFormData,
  } = useArticleCategoriesStore();

  const generateSlug = useCallback((): void => {
    if (!formData.name.trim()) {
      alert("Сначала введите название категории");
      return;
    }

    const slug = transliterateText(formData.name, true);
    updateFormField("slug", slug);
  }, [formData.name, updateFormField]);

  const saveImageFile = useCallback(
    (file: File): void => {
      setTempImageFile(file);
      const tempUrl = URL.createObjectURL(file);
      updateFormField("image", tempUrl);

      if (formData.name) updateFormField("imageAlt", `${formData.name}`);
    },
    [updateFormField, formData.name],
  );

  const removeImage = useCallback((): void => {
    if (formData.image && formData.image.startsWith("blob:")) {
      URL.revokeObjectURL(formData.image);
    }

    setTempImageFile(null);
    updateFormField("image", "");
    updateFormField("imageAlt", "");
  }, [formData.image, updateFormField]);

  const uploadImageToServer = useCallback(async (): Promise<{
    url: string;
    fileName: string;
  } | null> => {
    if (!tempImageFile) return null;

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", tempImageFile);

      const response = await fetch("/admin/cms/api/categories/image", {
        method: "POST",
        body: uploadFormData,
      });

      const { success, url, fileName, message } = await response.json();

      if (response.ok && success) {
        if (formData.image && formData.image.startsWith("blob:")) {
          URL.revokeObjectURL(formData.image);
        }
        setTempImageFile(null);
        return { url, fileName };
      } else {
        throw new Error(message || "Ошибка загрузки изображения");
      }
    } catch (e) {
      console.error("Ошибка загрузки изображения: ", e);
      throw e;
    }
  }, [tempImageFile, formData.image]);

  const getKeywordsArray = useCallback((): string[] => {
    return formData.keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
  }, [formData.keywords]);

  const resetForm = useCallback((): void => {
    if (formData.image && formData.image.startsWith("blob:")) {
      URL.revokeObjectURL(formData.image);
    }
    resetFormData();
    clearEditingId();
    setTempImageFile(null);
    setOriginalImageUrl("");
    setShowForm(false);
  }, [
    formData.image,
    clearEditingId,
    setShowForm,
    setOriginalImageUrl,
    resetFormData,
  ]);

  const deleteOldImage = useCallback(
    async (imageUrl: string): Promise<boolean> => {
      if (!imageUrl || imageUrl.startsWith("blob:")) return true;

      try {
        const filename = imageUrl.split("/").pop();
        if (!filename) return true;

        const response = await fetch(
          `/admin/cms/api/categories/image?file=${encodeURIComponent(filename)}`,
          {
            method: "DELETE",
          },
        );
        const { success } = await response.json();
        return success === true;
      } catch (e) {
        console.error("Ошибка при удалении изображения: ", e);
        return false;
      }
    },
    [],
  );

  const startCreating = useCallback((): void => {
    resetForm();
    setShowForm(true);
  }, [resetForm, setShowForm]);

  const startEditing = useCallback(
    (category: Category): void => {
      setEditingId(String(category._id));
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        keywords: (category.keywords || []).join(", "),
        image: category.image || "",
        imageAlt: category.imageAlt || "",
      });
      setOriginalImageUrl(category.image || "");
      setTempImageFile(null);
      setShowForm(true);
    },
    [setEditingId, setShowForm, setOriginalImageUrl, setFormData],
  );

  return {
    generateSlug,
    saveImageFile,
    removeImage,
    uploadImageToServer,
    getKeywordsArray,
    resetForm,
    deleteOldImage,
    startCreating,
    startEditing,
  };
};
