"use client";

import { useCallback, useEffect, useState } from "react";

import { CatalogProps } from "@/types/catalog";

import Loading from "./loading";
import CatalogAdminControls from "../CatalogAdminControls";
import CatalogGrid from "../CatalogGrid";

const CatalogPage = () => {
  const [categories, setCategories] = useState<CatalogProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draggingCategory, setDraggingCategory] = useState<CatalogProps | null>(null);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  // TODO: Make admin panel
  const isAdmin = true;

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/catalog");
      if (!response.ok)
        throw new Error(
          "Ошибка ответа сервера: ",
          response.status as ErrorOptions,
        );

      const data: CatalogProps[] = await response.json();
      const sortedCategories = data.sort((a, b) => a.order - b.order);

      setCategories(sortedCategories);
    } catch (e) {
      setError({
        error: e instanceof Error ? e : new Error("Неизвестная ошибка"),
        userMessage: "Не удалось загрузить категории",
      });
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
      setError({
        error: e instanceof Error ? e : new Error("Неизвестная ошибка"),
        userMessage: "Не удалось изменить порядок категорий",
      });
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
    <section className="px-[max(12px,calc((100%-1208px)/2))] mx-auto">
      {isAdmin && (
        <CatalogAdminControls
          isEditing={isEditing}
          onToggleEditingAction={handleToggleEditing}
          resetLayout={resetLayout}
        />
      )}
      <h1
        className="flex flex-row mb-4 md:mb-8 xl:mb-10 text-4xl mb:text-5xl xl:text-[64px] 
      text-[#414141] font-bold"
      >
        Каталог
      </h1>
      <CatalogGrid
        categories={categories}
        isEditing={isEditing}
        hoveredCategoryId={hoveredCategoryId}
        draggingCategory={draggingCategory}
        onDragStartAction={handleDragStart}
        onDragOverAction={handleDragOver}
        onDragLeaveAction={handleDragLeave}
        onDropAction={handleDrop}
      />
    </section>
  );
};

export default CatalogPage;
