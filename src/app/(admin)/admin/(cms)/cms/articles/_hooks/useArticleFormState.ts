import { useCallback, useState } from "react";
import { useArticleStore } from "@/store/articleStore";

import { transliterateText } from "@/utils/transliterateText";

export const useArticleFormState = () => {
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
  const { formData, setOriginalImageUrl, updateFormField, resetFormData } = useArticleStore();

  const generateSlug = useCallback((): void => {
    if (!formData.name.trim()) {
      alert("Сначала введите название статьи");
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

      const response = await fetch("/admin/cms/api/articles/image", {
        method: "POST",
        body: uploadFormData,
      });

      const { success, url, fileName, message } = await response.json();

      if (response.ok && success) {
        if (formData.image && formData.image.startsWith("blob:")) {
          URL.revokeObjectURL(formData.image);
        }
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
    setTempImageFile(null);
    setOriginalImageUrl("");
  }, [formData.image, setOriginalImageUrl, resetFormData]);

  return {
    generateSlug,
    saveImageFile,
    removeImage,
    uploadImageToServer,
    getKeywordsArray,
    resetForm,
  };
};
