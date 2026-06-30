"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Category } from "@/types/categories";

import CatalogMenu from "./CatalogMenu";

const CatalogMenuWrapper = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);

  const searchBlockRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchCategories = async () => {
    if (categories.length > 0) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/catalog");
      const data = await response.json();
      setCategories(data);
    } catch (e) {
      setError({
        error: e instanceof Error ? e : new Error("Неизвестная ошибка"),
        userMessage: "Не удалолсь загрузить каталог категорий",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openMenu = () => {
    if (error) setError(null);

    if (!isSearchFocused) {
      setIsCatalogOpen(true);
      fetchCategories();
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!searchBlockRef.current || !isCatalogOpen || isSearchFocused) return;

      const isInsideMenu = menuRef.current?.contains(e.target as Node);
      if (isInsideMenu) return;

      const searchBlockRect = searchBlockRef.current.getBoundingClientRect();
      if (
        e.clientX < searchBlockRect.left ||
        e.clientX > searchBlockRect.right
      ) {
        setIsCatalogOpen(false);
      }
    },
    [isCatalogOpen, isSearchFocused],
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const handleSearchFocusAction = (isFocused: boolean): void => {
    setIsSearchFocused(isFocused);
    if (isFocused) setIsCatalogOpen(false);
  };

  return (
    <CatalogMenu
      isLoading={isLoading}
      isCatalogOpen={isCatalogOpen}
      setIsCatalogOpen={setIsCatalogOpen}
      categories={categories}
      error={error}
      searchBlockRef={searchBlockRef}
      menuRef={menuRef}
      onFocusChangeAction={handleSearchFocusAction}
      onMouseEnter={openMenu}
    />
  );
};

export default CatalogMenuWrapper;
