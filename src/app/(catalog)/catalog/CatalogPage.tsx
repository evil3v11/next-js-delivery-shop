"use client";

import { useCallback, useEffect, useState } from "react";

import { CatalogProps } from "@/types/catalog";

import GridCategoryBlock from "../GridCategoryBlock";
import Loading from "./loading";

const CatalogPage = () => {
  const [categories, setCategories] = useState<CatalogProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draggingCategory, setDraggingCategory] = useState<CatalogProps | null>(
    null,
  );
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null,
  );
  // TODO: Make admin panel
  const isAdmin = true;

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/catalog");
      if (!response.ok) throw new Error("Error fetching catalog data");

      const data: CatalogProps[] = await response.json();
      const sortedCategories = data.sort((a, b) => a.order - b.order);

      setCategories(sortedCategories);
    } catch (e) {
      console.error("Unable to fetch categories: ", e);
      setError("Unable to fetch categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, [fetchCategories]);

  const updateOrderInDB = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/catalog", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(
          categories.map((category, index) => ({
            ...category,
            _id: category._id,
            order: index + 1,
          })),
        ),
      });

      if (!response.ok)
        throw new Error("Ошибка при обновлении порядка категорий");

      await response.json();
    } catch (e) {
      console.error("Ошибка при сохранении порядка: ", e);
      setError("Ошибка при сохранении порядка");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleEditing = async () => {
    if (isEditing) await updateOrderInDB();
    setIsEditing(!isEditing);
  };

  const handleDragStart = (category: CatalogProps) =>
    isEditing ? setDraggingCategory(category) : null;

  const handleDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();

    if (draggingCategory && categoryId !== draggingCategory._id) {
      setHoveredCategoryId(categoryId);
    }
  };

  const handleDragLeave = () => setHoveredCategoryId(null);

  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    if (!isEditing || !draggingCategory) return;

    setCategories((prev) => {
      const draggingIdx = prev.findIndex((c) => c._id === draggingCategory._id);
      const targetIdx = prev.findIndex((c) => c._id === categoryId);

      if (draggingIdx === -1 || targetIdx === -1) return prev;

      const newCategories = [...prev];
      const draggingItem = newCategories[draggingIdx];
      const targetItem = newCategories[targetIdx];

      const draggingSizes = {
        mobileColSpan: draggingItem.mobileColSpan,
        tabletColSpan: draggingItem.tabletColSpan,
        colSpan: draggingItem.colSpan,
      };

      const targetSizes = {
        mobileColSpan: targetItem.mobileColSpan,
        tabletColSpan: targetItem.tabletColSpan,
        colSpan: targetItem.colSpan,
      };

      newCategories[draggingIdx] = { ...targetItem, ...draggingSizes };
      newCategories[targetIdx] = { ...draggingItem, ...targetSizes };
      return newCategories;
    });

    setDraggingCategory(null);
    setHoveredCategoryId(null);
  };

  const resetLayout = () => fetchCategories();

  if (isLoading) return <Loading />;
  if (error) throw error;
  if (!categories.length) {
    return (
      <div className="text-center py-8">Категории в каталоге не найдены</div>
    );
  }

  return (
    <section className="px-[max(12px,calc((100%-1208px)/2))] mx-auto mb-20">
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleToggleEditing}
            className="border border-primary text-primary hover:text-white 
            hover:bg-[#ff6633] hover:border-transparent active:shadow-button-active w-1/2 
              h-10 rounded p-2 justify-center items-center transition-all duration-300 
              cursor-pointer select-none"
          >
            {isEditing ? "Закончить редактировать" : "Изменить расположение"}
          </button>
          {isEditing && (
            <button
              onClick={resetLayout}
              className="ml-3 p-2 text-xs justify-center items-center active:shadow-button-active
                border-none rounded cursor-pointer transition-colors duration-300 bg-[#f3f2f1]
                hover:shadow-button-secondary"
            >
              Сбросить
            </button>
          )}
        </div>
      )}
      <h1
        className="flex flex-row mb-4 md:mb-8 xl:mb-10 text-4xl mb:text-5xl xl:text-[64px] 
      text-[#414141] font-bold"
      >
        Каталог
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
        {categories.map((category) => (
          <div
            key={category._id}
            className={`${category.mobileColSpan} ${category.tabletColSpan} 
              ${category.colSpan} bg-gray-100 rounded overflow-hidden min-h-50 h-full
              ${isEditing ? "border-4 border-dashed border-gray-400" : ""}
              ${hoveredCategoryId === category._id ? "border-3 border-red-600 bg-gray-200" : ""}`}
            onDragOver={(e) => handleDragOver(e, category._id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, category._id)}
          >
            <div
              className={`h-full w-full 
                ${draggingCategory?._id === category._id ? "opacity-50" : "opacity-100"}`}
              draggable={isEditing}
              onDragStart={() => handleDragStart(category)}
            >
              <GridCategoryBlock {...category} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CatalogPage;
