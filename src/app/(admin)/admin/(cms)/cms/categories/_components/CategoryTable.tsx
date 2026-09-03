"use client";

import { useState } from "react";
import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";
import { useDnDStore } from "@/store/dndStore";
import { useDnD } from "@/hooks/useDnD";

import { getDisplayNumericId } from "../../_utils/getDisplayNumericId";

import type { Category } from "@/types/entities";
import type { CategoryTableProps } from "../_types";

import CategoryTableHeader from "./CategoryTableHeader";
import SortableItem from "./SortableItem";
import CMSSearchBar from "../../_components/CMSSearchBar";
import CategoryAdvancedFilters from "./CategoryAdvancedFilters";
import CMSFilterControls from "../../_components/CMSFilterControls";
import CMSResultStats from "../../_components/CMSResultStats";
import EmptyState from "../../_components/EmptyState";

const CategoryTable = ({ onDelete, onEdit, onReorder }: CategoryTableProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const {
    categories,
    isLoading,
    setCategories,
    searchQuery,
    fetchArticleCategories,
    setCurrentPage,
    setSearchQuery,
    clearSearchQuery,
    setFilterType,
    sortDirection,
    sortField,
    filterType,
    setSortField,
    setSortDirection,
    totalAllItems,
    totalFilteredItems,
  } = useArticleCategoriesStore();

  const {
    optimisticItems,
    isPending,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  } = useDnD<Category>({
    items: categories,
    setItems: setCategories,
    onOrderChange: onReorder,
  });

  const { draggedOverId } = useDnDStore()

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Загрузка категорий...</div>
    );
  }

  return (
    <div className="bg-white rounded shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <CMSSearchBar
            searchQuery={searchQuery}
            fetchItems={fetchArticleCategories}
            setCurrentPage={setCurrentPage}
            setSearchQuery={setSearchQuery}
            clearSearchQuery={clearSearchQuery}
          />
          <CMSFilterControls
            searchQuery={searchQuery}
            sortDirection={sortDirection}
            sortField={sortField}
            filterType={filterType}
            setSearchQuery={setSearchQuery}
            setSortDirection={setSortDirection}
            fetchItems={fetchArticleCategories}
            setSortField={setSortField}
            setFilterType={setFilterType}
            onToggleFilters={setShowFilters}
          />
        </div>
        <CMSResultStats
          type="categories"
          totalAllItems={totalAllItems}
          totalFilteredItems={totalFilteredItems}
          searchQuery={searchQuery}
        />
        {showFilters && <CategoryAdvancedFilters />}
      </div>
      <CategoryTableHeader />
      <div className="divide-y divide-gray-200">
        {!categories || !categories.length ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          optimisticItems.map((category) => {
            const isDragOver = draggedOverId === category._id;
            return (
              <div
                key={String(category._id)}
                draggable="true"
                onDragStart={() => handleDragStart(category._id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, category._id)}
                onDrop={(e) => handleDrop(e, category._id)}
                className={`${isDragOver ? "bg-blue-50" : ""} ${isPending ? "opacity-50" : ""}`}
              >
                <SortableItem
                  id={category._id}
                  category={category}
                  displayNumericId={getDisplayNumericId(category)}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CategoryTable;
