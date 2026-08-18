"use client";

import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

import { Search, X } from "lucide-react";

const CategorySearchBar = () => {
  const {
    searchQuery,
    setSearchQuery,
    clearSearchQuery,
    fetchArticleCategories,
    setCurrentPage,
  } = useArticleCategoriesStore();

  const handleSearchClick = async (): Promise<void> => {
    if (searchQuery.trim()) {
      setCurrentPage(1);
      await fetchArticleCategories({ page: 1, query: searchQuery });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick();
    }
  };

  const handleClear = async (): Promise<void> => {
    clearSearchQuery();
    setCurrentPage(1);
    await fetchArticleCategories({ page: 1 });
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        placeholder="Поиск..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-10 pr-24 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
        autoComplete="off"
      />
      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer duration-300"
            title="Очистить поле поиска"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={handleSearchClick}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm cursor-pointer duration-300"
        >
          Найти
        </button>
      </div>
    </div>
  );
};

export default CategorySearchBar;
