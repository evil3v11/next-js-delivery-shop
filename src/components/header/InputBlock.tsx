"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { SearchProduct } from "@/types/searchProducts";
import { TRANSLATIONS } from "@/utils/translations";

import iconSearch from "../../../public/icons-header/icon-search.svg";
import burgerMenu from "../../../public/icons-header/icon-burgerMenu.svg";

import HighlightText from "../HighlightText";

const InputBlock = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchbarRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [groupedProducts, setGroupedProducts] = useState<
    { category: string; products: SearchProduct[]; }[]
  >([]);

  useEffect(() => {
    const fetchSearchData = async () => {
      if (query.length > 1) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/search?query=${query}`);
          const data = await response.json();
          console.log(data);
          setGroupedProducts(data);
        } catch (error) {
          console.error("Не найден продукт или категория\n", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setGroupedProducts([]);
      }
    };

    const debounceTimer = setTimeout(fetchSearchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleInputFocus = () => setIsOpen(true);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (
        searchbarRef.current &&
        !searchbarRef.current?.contains(e.target as Node)
      )
        setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetSearch = () => {
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={searchbarRef} className="relative min-w-65.25 grow">
      <div className="relative rounded border border-primary shadow-button-default leading-[150%]">
        <input
          placeholder="Найти товар"
          className="w-full h-10 p-2 outline-none text-[#8f8f8f] text-base"
          onFocus={handleInputFocus}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Image
          src={iconSearch}
          alt="Поиск"
          height={24}
          width={24}
          className="absolute right-2 top-2"
        />
      </div>

      {isOpen && (
        <div
          className="absolute -mt-0.5 rounded-b left-0 right-0 z-10 max-h-[300px] 
            overflow-y-auto bg-white border border-primary border-t-0 shadow-inherit 
            wrap-break-word"
        >
          {isLoading ? (
            <div className="p-4 text-center">Поиск товаров...</div>
          ) : groupedProducts.length > 0 ? (
            <div className="p-2 flex flex-col gap-2">
              {groupedProducts.map(({ category, products }) => (
                <div key={category} className="flex flex-col gap-2 ">
                  <Link
                    href={`/category/${encodeURIComponent(category)}`}
                    className="flex justify-between gap-x-4 hover:bg-gray-100 px-2 rounded 
                  cursor-pointer"
                    onClick={resetSearch}
                  >
                    <div>
                      <HighlightText
                        text={TRANSLATIONS[category] || category}
                        highlight={query}
                      />
                    </div>
                    <Image
                      src={burgerMenu}
                      alt={TRANSLATIONS[category] || category}
                      height={24}
                      width={24}
                      className="shrink-0 self-center"
                    />
                  </Link>
                  <ul className="flex flex-col gap-2.5 p-1">
                    {products.map(({ title, id }) => (
                      <li key={id} className="p-1 pl-5 hover:bg-gray-100">
                        <Link
                          href={`/product/${id}`}
                          className="cursor-pointer"
                          onClick={resetSearch}
                        >
                          <HighlightText text={title} highlight={query} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : query.length > 1 ? (
            <div className="text-[#8f8f8f] py-2 px-4">
              По вашему запросу ничего не найдено
            </div>
          ) : (
            <div className="text-[#8f8f8f] p-2">
              Введите 2 и более символов для поиска
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InputBlock;
