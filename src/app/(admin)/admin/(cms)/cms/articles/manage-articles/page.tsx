"use client";

import { useArticleStore } from "@/store/articleStore";
import { useArticlesCRUD } from "../_hooks/useArticlesCRUD";

import CMSHeader from "../../_components/CMSHeader";
import Notification from "../../_components/Notification";
import ItemsPerPageSelector from "../../_components/ItemsPerPageSelector";
import CMSPagination from "../../_components/CMSPagination";
import ArticleTable from "./_components/ArticleTable";

const ManageArticlesPage = () => {
  const {
    notification,
    setNotification,
    handleItemsPerPageChange,
    handleReorder,
  } = useArticlesCRUD();

  const { totalAllItems, totalPages, currentPage, itemsPerPage } = useArticleStore();

  return (
    <div className="relative">
      <CMSHeader
        title="Управление статьями"
        description={`Всего статей: ${totalAllItems}`}
      />
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="flex flex-col items-end mb-5">
        <ItemsPerPageSelector
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        />
        <div className="text-sm text-gray-500 mt-1">
          Текущие параметры: страница: {currentPage}, элементов: {itemsPerPage}
        </div>
      </div>
      <ArticleTable onReorder={handleReorder} />
      {totalPages > 1 && <CMSPagination type="articles" />}
    </div>
  );
};

export default ManageArticlesPage;
