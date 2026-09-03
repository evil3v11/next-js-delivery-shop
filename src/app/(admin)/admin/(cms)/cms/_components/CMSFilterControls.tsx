"use client";

import { useState } from "react";

import { CMSFilterControlsProps } from "@/types/props";

import { Filter, X } from "lucide-react";
import {
  ArticleFilterType,
  ArticleSortField,
  CategoryFilterType,
  CategorySortField,
} from "@/types/filters";

const CMSFilterControls = <
  Field extends ArticleSortField | CategorySortField,
  Filter extends ArticleFilterType | CategoryFilterType,
>({
  sortField,
  sortDirection,
  filterType,
  searchQuery,
  setSearchQuery,
  setSortField,
  setSortDirection,
  setFilterType,
  fetchItems,
  onToggleFilters,
}: CMSFilterControlsProps<Field, Filter>) => {
  const [localShowFilters, setLocalShowFilters] = useState(false);

  const hasActiveFilters = !!(
    sortField !== "numericId" ||
    sortDirection != "asc" ||
    filterType !== "all" ||
    searchQuery
  );

  const resetFilters = () => {
    setSearchQuery("");
    setSortField("numericId" as Field);
    setSortDirection("asc");
    setFilterType("all" as Filter);
    fetchItems({ page: 1, query: "" });
  };

  const handleToggleFilters = () => {
    const toggleControls = !localShowFilters;
    setLocalShowFilters(toggleControls);
    if (onToggleFilters) onToggleFilters(toggleControls);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggleFilters}
        className={`flex items-center gap-2 px-4 py-2 border rounded cursor-pointer duration-300 ${
          localShowFilters
            ? "bg-gray-100 border-gray-300"
            : "border-gray-300 hover:bg-gray-50"
        }`}
        title={localShowFilters ? "Скрыть фильтры" : "Показать фильтры"}
      >
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">Фильтры</span>
      </button>
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer duration-300"
          title="Сбросить все фильтры"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Сбросить</span>
        </button>
      )}
    </div>
  );
};

export default CMSFilterControls;
