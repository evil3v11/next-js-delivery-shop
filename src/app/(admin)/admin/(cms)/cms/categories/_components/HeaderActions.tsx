"use client";

import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

import type { HeaderActionsProps } from "../../_types";

import { Plus } from "lucide-react";
import ItemsPerPageSelector from "../../_components/ItemsPerPageSelector";

const HeaderActions = ({ onCreate }: HeaderActionsProps) => {
  const {
    currentPage,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage,
    fetchArticleCategories,
  } = useArticleCategoriesStore();

  const handleItemsPerPageChange = (itemsPerPage: number): void => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
    fetchArticleCategories({ page: 1 });
  };

  return (
    <div className="flex gap-x-10 justify-between items-center mb-4">
      <div className="flex gap-2">
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center 
          gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer duration-300"
        >
          <Plus className="w-5 h-5" />
          Новая категория
        </button>
      </div>
      <div className="flex flex-col items-end">
        <ItemsPerPageSelector
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        />
        <div className="text-sm text-gray-500 mt-1">
          Текущие параметры: страница: {currentPage}, элементов: {itemsPerPage}
        </div>
      </div>
    </div>
  );
};

export default HeaderActions;
