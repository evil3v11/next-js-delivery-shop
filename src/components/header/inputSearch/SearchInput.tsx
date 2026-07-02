import Image from "next/image";

import { SearchInputProps } from "@/types/searchInputProps";

import iconSearch from "../../../../public/icons-header/icon-search.svg";

const SearchInput = ({
  query,
  setQuery,
  handleSearch,
  handleInputFocus,
  handleInputBlur,
}: SearchInputProps) => {
  return (
    <div className="relative rounded border border-primary shadow-button-default leading-[150%]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <input
          placeholder="Найти товар"
          className="w-full h-10 p-2 outline-none text-[#8f8f8f] text-base caret-primary"
          onFocus={handleInputFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={handleInputBlur}
        />
        <button
          type="submit"
          className="absolute right-2 top-2 w-6 h-6 cursor-pointer"
        >
          <Image src={iconSearch} alt="Поиск" height={24} width={24} />
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
