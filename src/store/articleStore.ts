import { create } from "zustand";

import type { ArticleState } from "@/types/store/storeState";
import type { ArticleFormData } from "@/app/(admin)/admin/(cms)/cms/articles/_types";

const initialFormData: ArticleFormData = {
  name: "",
  slug: "",
  description: "",
  keywords: "",
  image: "",
  imageAlt: "",
  categoryId: "",
  categoryName: "",
  categorySlug: "",
  status: "draft",
  content: "",
  metaTitle: "",
  metaDescription: "",
  isFeatured: false,
};

export const useArticleStore = create<ArticleState>((set) => ({
  isSubmitting: false,
  formData: initialFormData,
  originalImageUrl: "",
  isUploading: false,
  editingId: "",
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setFormData: (formData) => set({ formData }),
  setOriginalImageUrl: (originalImageUrl) => set({ originalImageUrl }),
  updateFormField: (field, value) =>
    set((state) => ({ formData: { ...state.formData, [field]: value } })),
  resetFormData: () => set({ formData: initialFormData }),
  setIsUploading: (isUploading) => set({ isUploading }),
  createArticle: async (articleData) => {
    try {
      const response = await fetch("/admin/cms/api/articles", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(articleData),
      });

      return await response.json();
    } catch (e) {
      console.error("Ошибка при создании новой категории: ", e);
      return {
        success: false,
        message: `Ошибка при создании новой категории: ${e}`,
      };
    }
  },
}));
