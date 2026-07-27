"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";

import { SearchProduct } from "@/types/searchProducts";

import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

const InputBlock = ({
  onFocusChangeAction,
}: {
  onFocusChangeAction: (isFocused: boolean) => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchbarRef = useClickOutsideModal<HTMLDivElement>(() => setIsOpen(false));

  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [groupedProducts, setGroupedProducts] = useState<
    { category: string; products: SearchProduct[] }[]
  >([]);

  const router = useRouter();

  useEffect(() => {
    const fetchSearchData = async (): Promise<void> => {
      if (query.length > 1) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/search?query=${query}`);
          const data = await response.json();
          setGroupedProducts(data);
        } catch (error) {
          console.error("Не найден продукт или категория\n", error);
          setError("Не найден продукт или категория");
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

  const handleInputFocus = (): void => {
    setIsOpen(true);
    onFocusChangeAction(true);
  };

  const resetSearch = (): void => {
    setQuery("");
    setIsOpen(false);
    onFocusChangeAction(false);
  };

  const handleSearch = (): void => {
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleInputBlur = () => onFocusChangeAction(false);

  return (
    <div ref={searchbarRef} className="relative min-w-65.25 grow">
      <SearchInput
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        handleInputFocus={handleInputFocus}
        handleInputBlur={handleInputBlur}
      />
      {isOpen && (
        <div
          className="absolute -mt-0.5 rounded-b left-0 right-0 z-10 max-h-[300px] 
            overflow-y-auto bg-white border border-primary border-t-0 shadow-inherit 
            wrap-break-word"
        >
          {error ? (
            <div className="p-2 text-red-500 text-sm">
              {error}
              <button
                onClick={() => setError(null)}
                className="text-blue-700 hover:text-blue-500 cursor-pointer"
              >
                Повторить
              </button>
            </div>
          ) : (
            <SearchResults
              isLoading={isLoading}
              query={query}
              groupedProducts={groupedProducts}
              resetSearch={resetSearch}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default InputBlock;
