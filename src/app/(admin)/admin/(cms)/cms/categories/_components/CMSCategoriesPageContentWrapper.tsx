"use client";

import { Activity } from "react";

import { useCategoriesCRUD } from "../_hooks/useCategoriesCRUD";
import { useCategoryFormState } from "../_hooks/useCategoryFormState";
import { useCategoryFormValidation } from "../_hooks/useCategoryFormValidation";
import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

import { CATEGORY_SEO_RECOMMENDATIONS } from "../../_utils/recommendations";

import CMSHeader from "../../_components/CMSHeader";
import SEORecommendations from "../../_components/SEORecommendations";
import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";
import Notification from "../../_components/Notification";
import WarningAlert from "./WarningAlert";
import HeaderActions from "./HeaderActions";
import CMSPagination from "../../_components/CMSPagination";
import CategoryReorderStatus from "./CategoryReorderStatus";

const CMSCategoriesPageContentWrapper = () => {
  const {
    startCreating,
    startEditing,
    generateSlug,
    saveImageFile,
    removeImage,
    resetForm,
    uploadImageToServer,
  } = useCategoryFormState();

  const {
    notification,
    setNotification,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleReorder,
  } = useCategoriesCRUD(uploadImageToServer);

  const { errors } = useCategoryFormValidation();

  const { totalPages, totalAllItems, isReordering, showForm, editingId } =
    useArticleCategoriesStore();

  return (
    <>
      <CMSHeader
        title="Управление категориями"
        description={`Всего категорий: ${totalAllItems}`}
      />
      {notification && (
        <Notification
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
          showForm={showForm}
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

export default CMSCategoriesPageContentWrapper;
