"use client";

import { Search, Loader } from "lucide-react";

interface SearchInputProps {
  searchTerm: string;
  isLoading: boolean;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const SearchInput = ({
  searchTerm,
  isLoading,
  onSearchTermChange,
  onSearch,
  onKeyPress,
}: SearchInputProps) => {
  return (
    <div className="mb-6 relative">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-main-text"
            size={20}
          />
          <input
            type="text"
            placeholder="Введите название товара или артикул..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyDown={onKeyPress}
            className="w-full pl-10 pr-4 py-2 rounded outline-none border border-primary bg-white 
            focus:shadow-button-default duration-300"
          />
        </div>
        <button
          onClick={onSearch}
          disabled={isLoading || searchTerm.trim().length < 3}
          className="bg-primary hover:shadow-button-default active:shadow-button-active rounded 
          text-white duration-300 px-4 py-2 flex flex-row gap-2 items-center justify-center disabled:opacity-50 
          cursor-pointer disabled:cursor-not-allowed w-fit self-center"
        >
          {isLoading ? (
            <Loader size={18} className="animate-spin" />
          ) : (
            <Search size={18} />
          )}
          Найти
        </button>
      </div>
      <p className="text-sm mt-5 text-center md:text-start">
        {searchTerm.trim().length === 0 ? (
          <span className="text-main-text">
            Введите минимум 3 символа для поиска
          </span>
        ) : searchTerm.trim().length < 3 ? (
          <span className="text-secondary">
            Введите еще {3 - searchTerm.trim().length} символ(а, ов) для поиска
          </span>
        ) : (
          <span className="text-[#008c49]">✓ Можно выполнить поиск</span>
        )}
      </p>
    </div>
  );
};

export default SearchInput;
