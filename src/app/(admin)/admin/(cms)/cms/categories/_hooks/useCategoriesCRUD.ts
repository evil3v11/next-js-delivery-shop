import { useEffect, useState } from "react";
import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";
import { useAuthStore } from "@/store/authStore";
import { useDnDStore } from "@/store/dndStore";
import { useCategoryFormValidation } from "./useCategoryFormValidation";
import { useCategoryFormState } from "./useCategoryFormState";

import type { Category } from "../../../../../../../types/entities";

export const useCategoriesCRUD = (uploadImageToServer: () => Promise<{ url: string; fileName: string; } | null>) => {
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { user } = useAuthStore();
  const author = `${user?.lastName} ${user?.name}`.trim() || "Неизвестен";

  const { validateForm } = useCategoryFormValidation();
  const { getKeywordsArray, deleteOldImage, resetForm } = useCategoryFormState();

  const {
    categories,
    editingId,
    originalImageUrl,
    formData,
    setIsSubmitting,
    currentPage,
    fetchArticleCategories,
    createCategory,
    deleteCategory,
    updateCategory,
  } = useArticleCategoriesStore();

  const { setIsReordering, reorderItems, resetDnDStore } = useDnDStore()

  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  useEffect(() => {
    fetchArticleCategories({ page: currentPage });
  }, [fetchArticleCategories, currentPage]);

  const handleCreateCategory = async (e: React.SubmitEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm(formData)) {
      setNotification({
        type: "error",
        message: "Проверьте введенные данные в форму на наличие ошибок",
      });
      return;
    }
    try {
      setIsSubmitting(true);

      let finalImageUrl = "";
      if (formData.image && formData.image.startsWith("blob:")) {
        try {
          const uploadResult = await uploadImageToServer();
          if (uploadResult) finalImageUrl = uploadResult.url;
          else throw new Error("Не удалось загрузить изображение");
        } catch (uploadError) {
          console.error("Ошибка при загрузке изображения: ", uploadError);
          setNotification({
            type: "error",
            message: "Не удалось загрузить изображение",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const categoryData = {
        ...formData,
        image: finalImageUrl,
        keywords: getKeywordsArray(),
        numericId: null,
        author,
      };

      const { success, message } = await createCategory(categoryData);
      if (success) {
        setNotification({
          type: "success",
          message: "Категория успешно создана",
        });
        resetForm();
      } else {
        setNotification({
          type: "error",
          message: message || "Ошибка создания категории",
        });
      }
    } catch (e) {
      console.error("Непредвиденная ошибка: ", e);
      setNotification({
        type: "error",
        message: "Непредвиденная ошибка сервера",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string): Promise<void> => {
    if (!confirm("Вы уверены, что хотите удалить эту категорию?")) return;
    const categoryToDelete = categories.find(
      (c) => String(c._id) === categoryId,
    );

    const { success, message } = await deleteCategory(categoryId);
    if (success) {
      if (categoryToDelete?.image) {
        try {
          await deleteOldImage(categoryToDelete.image);
        } catch (e) {
          console.error("Не удалось удалить изображение: ", e);
        }
      }

      setNotification({
        type: "success",
        message: "Категория успешно удалена",
      });
    } else {
      setNotification({
        type: "error",
        message: message || "Ошибка при удалении категории статей",
      });
    }
  };

  const handleUpdateCategory = async (e: React.SubmitEvent): Promise<void> => {
    e.preventDefault();
    if (!editingId) return;

    try {
      setIsSubmitting(true);
      if (!validateForm(formData)) {
        console.error("Ошибка валидации формы");
        setNotification({
          type: "error",
          message: "Проверьте введенные данные в форму на наличие ошибок",
        });
        setIsSubmitting(false);
        return;
      }

      let finalImageUrl = formData.image;
      let shouldDeleteOldImage = false;

      if (formData.image && formData.image.startsWith("blob:")) {
        try {
          const uploadResult = await uploadImageToServer();
          if (uploadResult) {
            finalImageUrl = uploadResult.url;
            shouldDeleteOldImage = true;
          } else throw new Error("Не удалось загрузить изображение");
        } catch (uploadError) {
          console.error("Ошибка при загрузке изображения: ", uploadError);
          setNotification({
            type: "error",
            message: "Не удалось загрузить изображение",
          });
          setIsSubmitting(false);
          return;
        }
      } else if (!formData.image && originalImageUrl) {
        shouldDeleteOldImage = true;
      }

      if (shouldDeleteOldImage && originalImageUrl) {
        const deleteSuccess = await deleteOldImage(originalImageUrl);
        if (deleteSuccess) console.log("Старое изображение успешно удалено");
      }

      const updateData = {
        ...formData,
        image: finalImageUrl,
        keywords: getKeywordsArray(),
      };

      const { success, message } = await updateCategory(editingId, updateData);
      if (success) {
        setNotification({
          type: "success",
          message: "Категория успешно обновлена",
        });
        resetForm();
      } else {
        setNotification({
          type: "error",
          message: message || "Ошибка обновления категории",
        });
      }
    } catch (e) {
      console.error("Непредвиденная ошибка: ", e);
      setNotification({
        type: "error",
        message: "Непредвиденная ошибка сервера",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReorder = async (reorderedItems: Category[]): Promise<void> => {
    try {
      setIsReordering(true);
      const updateData = reorderedItems.map((category) => ({
        _id: String(category._id),
        numericId: category.numericId || 0,
      }));

      const { success } = await reorderItems(updateData, 'categories');
      if (success) {
        setNotification({
          type: "success",
          message: "Порядок успешно обновлен",
        });
        await fetchArticleCategories({ page: currentPage })
      } else {
        setNotification({
          type: "error",
          message: "Ошибка при обновлении порядка",
        });
      }

      
    } catch (e) {
      console.log("Ошибка при обновлении порядка: ", e);
      setNotification({
        type: "error",
        message: `Ошибка при обновлении порядка: ${e}`,
      });
    } finally {
      setIsReordering(false);
      resetDnDStore()
    } 
  };

  return {
    notification,
    setNotification,
    handleCreateCategory,
    handleDeleteCategory,
    handleUpdateCategory,
    handleReorder,
  };
};