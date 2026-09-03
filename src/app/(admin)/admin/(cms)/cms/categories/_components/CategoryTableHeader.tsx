"use client";

import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

import { CategorySortField } from "@/types/filters";

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

  const handleSort = async (field: CategorySortField): Promise<void> => {
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

  const renderSortIcon = (field: CategorySortField): React.JSX.Element | null => {
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
    <div className="hidden p-4 lg:block border border-gray-200">
      <div className="grid lg:grid-cols-[32px_40px_50px_100px_80px_120px_120px_80px_80px_80px_100px] 
      xl:grid-cols-[32px_40px_50px_120px_80px_160px_160px_80px_80px_80px_100px] gap-2 items-center justify-between">
        <div className="w-6" />
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
          className="text-center cursor-pointer hover:text-gray-700 flex items-center justify-center"
          onClick={() => handleSort("articles")}
          title="Сортировать по кол-ву статей"
        >
          Статей {renderSortIcon("articles")}
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
