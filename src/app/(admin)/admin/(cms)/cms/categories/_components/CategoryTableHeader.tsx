"use client";

import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

import type { SortField } from "../_types";

import { ChevronUp, ImageIcon } from "lucide-react";

const CategoryTableHeader = () => {
  const {
    currentPage,
    searchQuery,
    filterType,
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
    fetchArticleCategories,
  } = useArticleCategoriesStore();

  const handleSort = async (field: SortField): Promise<void> => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }

    await fetchArticleCategories({
      page: currentPage,
      query: searchQuery,
      filterBy: filterType,
    });
  };

  const renderSortIcon = (field: SortField): React.JSX.Element | null => {
    if (sortField !== field) return null;
    return (
      <ChevronUp
        className={`w-4 h-4 ml-1 transition-transform duration-200 ${
          sortDirection === "desc" ? "rotate-180" : ""
        }`}
      />
    );
  };

  return (
    <div className="hidden lg:block border border-gray-200">
      <div className="grid grid-cols-[0.3fr_0.5fr_1fr_2fr_2fr_2fr_2fr_1fr_1fr_2fr] gap-2 px-2 py-4 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div />
        <div
          title="Сортировать по ID"
          onClick={() => handleSort("numericId")}
          className="text-center cursor-pointer hover:text-gray-700 flex items-center justify-center"
        >
          ID
          {renderSortIcon("numericId")}
        </div>
        <div
          title="Изображение категории"
          className="text-center flex items-center justify-center"
        >
          <ImageIcon className="w-4 h-4" />
        </div>
        <div
          title="Сортировать по названию"
          onClick={() => handleSort("name")}
          className="cursor-pointer hover:text-gray-700 flex items-center"
        >
          Название
          {renderSortIcon("name")}
        </div>
        <div
          title="Сортировать по алиасу"
          onClick={() => handleSort("slug")}
          className="cursor-pointer hover:text-gray-700 flex items-center"
        >
          Алиас
          {renderSortIcon("slug")}
        </div>
        <div>Описание</div>
        <div className="text-center">Ключевые слова</div>
        <div
          title="Сортировать по автору"
          onClick={() => handleSort("author")}
          className="text-center cursor-pointer hover:text-gray-700 flex items-center justify-center"
        >
          Автор
          {renderSortIcon("author")}
        </div>
        <div
          title="Сортировать по дате создания"
          onClick={() => handleSort("createdAt")}
          className="cursor-pointer hover:text-gray-700 flex items-center"
        >
          Создана
          {renderSortIcon("createdAt")}
        </div>
        <div className="text-center">Действия</div>
      </div>
    </div>
  );
};

export default CategoryTableHeader;
