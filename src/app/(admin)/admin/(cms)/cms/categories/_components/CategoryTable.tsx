"use client";

import { useState } from "react";
import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

import { Category } from "../../../../../../../types/entities";
import { CategoryTableProps } from "../_types";

import CategoryTableHeader from "./CategoryTableHeader";
import EmptyState from "./EmptyState";
import SortableItem from "./SortableItem";
import CategorySearchBar from "./CategorySearchBar";
import CategoryAdvancedFilters from "./CategoryAdvancedFilters";
import CategoryFilterControls from "./CategoryFilterControls";
import CategoryResultStats from "./CategoryResultStats";

const CategoryTable = ({ onDelete, onEdit, onReorder }: CategoryTableProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const {
    categories,
    isLoading,
    draggedId,
    setDraggedId,
    draggedOverId,
    setDraggedOverId,
    setTempOrder,
    setCategories
  } = useArticleCategoriesStore();

  const getDisplayNumericId = (category: Category): number | null =>
    category.numericId;

  const handleDragStart = (id: string) => setDraggedId(id);

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId && id !== draggedId) setDraggedOverId(id);
  };

  const handleDrop = (e: React.DragEvent, droppedId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== droppedId) {
      const oldIndex = categories.findIndex(c => String(c._id) === droppedId)
      const newIndex = categories.findIndex(c => String(c._id) === draggedId)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = [...categories]
        const [movedItem] = newItems.splice(oldIndex, 1)
        newItems.splice(newIndex, 0, movedItem)

        const newTempOrder = new Map()
        for (let i = 0; i < newItems.length; i++) {
          newTempOrder.set(String(newItems[i]._id), i + 1)
        }

        setTempOrder(newTempOrder)
        setCategories(newItems)
        if (onReorder) {
          const reorderedItems = newItems.map((item, i) => ({ ...item, numericId: i + 1 }))
          onReorder(reorderedItems)
        }
      }
    }

    setDraggedId(null)
    setDraggedOverId(null)
    setTempOrder(new Map())
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Загрузка категорий...</div>
    );
  }

  return (
    <div className="bg-white rounded shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <CategorySearchBar />
          <CategoryFilterControls onToggleFilters={setShowFilters} />
        </div>
        <CategoryResultStats />
        {showFilters && <CategoryAdvancedFilters />}
      </div>
      <CategoryTableHeader />
      <div className="divide-y divide-gray-200">
        {!categories || !categories.length ? (
          <EmptyState  />
        ) : (
          categories.map((category) => {
            const isDragOver = draggedOverId === category._id;
            return (
              <div
                key={String(category._id)}
                draggable="true"
                onDragStart={() => handleDragStart(category._id)}
                onDragOver={(e) => handleDragOver(e, category._id)}
                onDrop={(e) => handleDrop(e, category._id)}
                className={`${isDragOver ? "bg-blue-50" : ""}`}
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
