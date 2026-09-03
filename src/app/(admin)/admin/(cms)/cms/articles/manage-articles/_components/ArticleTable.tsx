"use client";

import { useState } from "react";
import { useDnD } from "@/hooks/useDnD";
import { useDnDStore } from "@/store/dndStore";
import { useArticleStore } from "@/store/articleStore";

import { getDisplayNumericId } from "../../../_utils/getDisplayNumericId";

import { Article } from "@/types/entities";

import CMSSearchBar from "../../../_components/CMSSearchBar";
import CMSFilterControls from "../../../_components/CMSFilterControls";
import CMSResultStats from "../../../_components/CMSResultStats";
import ArticleAdvancedFilters from "./ArticleAdvancedFilters";
import EmptyState from "../../../_components/EmptyState";
import ArticleTableHeader from "./ArticleTableHeader";
import ArticleSortableItem from "./ArticleSortableItem";

const ArticleTable = ({
  onReorder,
}: {
  onReorder: (reorderedItems: Article[]) => Promise<void>;
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const {
    articles,
    setArticles,
    isLoading,
    fetchArticles,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    clearSearchQuery,
    sortDirection,
    sortField,
    setSortDirection,
    setSortField,
    setFilterType,
    filterType,
    totalAllItems,
    totalFilteredItems,
  } = useArticleStore();

  const { draggedOverId } = useDnDStore();

  const {
    optimisticItems,
    isPending,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  } = useDnD<Article>({
    items: articles,
    setItems: setArticles,
    onOrderChange: onReorder,
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Загрузка статей...</div>
    );
  }

  return (
    <div className="bg-white rounded shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <CMSSearchBar
            searchQuery={searchQuery}
            fetchItems={fetchArticles}
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
            fetchItems={fetchArticles}
            setSortField={setSortField}
            setFilterType={setFilterType}
            onToggleFilters={setShowFilters}
          />
        </div>
        <CMSResultStats
          type="articles"
          totalAllItems={totalAllItems}
          totalFilteredItems={totalFilteredItems}
          searchQuery={searchQuery}
        />
        {showFilters && <ArticleAdvancedFilters />}
      </div>
      <ArticleTableHeader />
      <div className="divide-y divide-gray-200">
        {!articles || !articles.length ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          optimisticItems.map((article) => {
            const isDragOver = draggedOverId === article._id;
            return (
              <div
                key={String(article._id)}
                draggable="true"
                onDragStart={() => handleDragStart(article._id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, article._id)}
                onDrop={(e) => handleDrop(e, article._id)}
                className={`${isDragOver ? "bg-blue-50" : ""} ${isPending ? "opacity-50" : ""}`}
              >
                <ArticleSortableItem
                  id={article._id}
                  article={article}
                  displayNumericId={getDisplayNumericId(article)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ArticleTable;
