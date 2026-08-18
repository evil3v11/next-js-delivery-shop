"use client";

import { Activity, useEffect, useState } from "react";

import { useAuthStore } from "@/store/authStore";
import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";
import { useCategoryFormState } from "../../_hooks/useCategoryFormState";
import { useCategoryFormValidation } from "../../_hooks/useCategoryFormValidation";
// import { useCategoriesCRUD } from "../../_hooks/useCategoriesCRUD";

import { CATEGORY_SEO_RECOMMENDATIONS } from "../../_utils/recommendations";
import type { Category } from "../../_types/entities";

import CMSHeader from "../../_components/CMSHeader";
import SEORecommendations from "../../_components/SEORecommendations";
import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";
import CategoryNotification from "./CategoryNotification";
import WarningAlert from "./WarningAlert";
import HeaderActions from "./HeaderActions";
import CMSPagination from "../../_components/CMSPagination";
import CategoryReorderStatus from "./CategoryReorderStatus";

const CMSCategoriesPageWrapper = () => {
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { user } = useAuthStore();
  const author = `${user?.lastName} ${user?.name}`.trim() || "Неизвестен";

  const { errors, validateForm } = useCategoryFormValidation();
  // const { createCategory, deleteCategory, updateCategory } = useCategoriesCRUD();
  const {
    generateSlug,
    saveImageFile,
    removeImage,
    uploadImageToServer,
    getKeywordsArray,
    deleteOldImage,
    startCreating,
    startEditing,
    resetForm,
  } = useCategoryFormState();

  const {
    categories,
    totalAllItems,
    editingId,
    showForm,
    originalImageUrl,
    formData,
    setIsSubmitting,
    totalPages,
    currentPage,
    fetchArticleCategories,
    createCategory,
    deleteCategory,
    updateCategory,
    setIsReordering,
    reorderItems,
    isReordering,
  } = useArticleCategoriesStore();

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
          message: "Категория успешно обновленна",
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

      const { success } = await reorderItems(updateData);
      if (success) {
        setNotification({
          type: "success",
          message: "Порядок успешно обновлен",
        });
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
    }
  };

  return (
    <>
      <CMSHeader
        title="Управление категориями"
        description={`Всего категорий: ${totalAllItems}`}
      />
      {notification && (
        <CategoryNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <HeaderActions onCreate={startCreating} />
      {isReordering && <CategoryReorderStatus />}
      <WarningAlert />
      <Activity mode={showForm ? "visible" : "hidden"}>
        <CategoryForm
          errors={errors}
          onGenerateSlug={generateSlug}
          onSaveImageFile={saveImageFile}
          onRemoveImage={removeImage}
          onSubmit={editingId ? handleUpdateCategory : handleCreateCategory}
          onCancel={resetForm}
        />
      </Activity>
      <CategoryTable
        onDelete={handleDeleteCategory}
        onEdit={startEditing}
        onReorder={handleReorder}
      />
      {totalPages > 1 && <CMSPagination />}
      <SEORecommendations recommendations={CATEGORY_SEO_RECOMMENDATIONS} />
    </>
  );
};

export default CMSCategoriesPageWrapper;
