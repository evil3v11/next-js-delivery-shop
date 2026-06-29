"use client";

import { useRef, useState } from "react";

import { Category } from "@/types/categories";

import Link from "next/link";

import UserBlock from "./UserBlock";
import LogoBlock from "./LogoBlock";
import SearchBlock from "./SearchBlock";

const Header = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
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
      console.error("Ошибка загрузки категорий:\n", e);
    } finally {
      setIsLoading(false);
    }
  };

  const openMenu = () => {
    if (!isSearchFocused) {
      setIsCatalogOpen(true);
      fetchCategories();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!searchBlockRef.current || !isCatalogOpen || isSearchFocused) return;

    const isInsideMenu = menuRef.current?.contains(e.target as Node);
    if (isInsideMenu) return;

    const searchBlockRect = searchBlockRef.current.getBoundingClientRect();
    if (e.clientX < searchBlockRect.left || e.clientX > searchBlockRect.right) {
      setIsCatalogOpen(false);
    }
  };

  const handleSearchFocusAction = (isFocused: boolean): void => {
    setIsSearchFocused(isFocused);
    if (isFocused) setIsCatalogOpen(false);
  };

  return (
    <header
      className="bg-white w-full md:shadow-default flex flex-col relative z-50 
    md:flex-row xl:gap-y-7 md:gap-10 md:p-2 justify-center"
      onMouseMove={handleMouseMove}
    >
      <div
        className="flex flex-row gap-4 xl:gap-10 py-2 px-4 items-center shadow-default 
      md:shadow-none"
      >
        <LogoBlock />
        <div
          className="flex items-center"
          onMouseEnter={openMenu}
          ref={searchBlockRef}
        >
          <SearchBlock onFocusChangeAction={handleSearchFocusAction} />
        </div>
      </div>

      {isCatalogOpen && (
        <div
          className="hidden md:block absolute top-full left-0 w-full px-[max(12px,calc((100%-1208px)/2))] 
          bg-white shadow-catalog-menu z-50"
          ref={menuRef}
          onMouseLeave={() => setIsCatalogOpen(false)}
        >
          <div className="mx-auto px-4 py-3">
            {isLoading ? (
              <div className="py-2 text-center">Загрузка категорий...</div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                {categories.map(({ id, title }) => (
                  <Link
                    key={id}
                    href={`/category/${id}`}
                    className="block px-4 py-2 text-[#414141] hover:text-[#ff6633] 
                font-bold duration-300"
                    onClick={() => setIsCatalogOpen(false)}
                  >
                    {title}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center">Нет доступных категорий</div>
            )}
          </div>
        </div>
      )}

      <UserBlock />
    </header>
  );
};

export default Header;
