import Image from "next/image";
import Link from "next/link";

import { SearchResultsProps } from "@/types/searchResultsProps";
import { TRANSLATIONS } from "@/utils/translations";

import burgerMenu from "../../../../public/icons-header/icon-burgerMenu.svg";

import HighlightText from "../../HighlightText";
import MiniLoader from "../../MiniLoader";

const SearchResults = ({
  isLoading,
  query,
  groupedProducts,
  resetSearch,
}: SearchResultsProps) => {
  if (isLoading) return <MiniLoader />;

  if (groupedProducts.length > 0) {
    return (
      <div className="p-2 flex flex-col gap-2 text-[#414141]">
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
    );
  }

  if (query.length > 1)
    return <div className="text-[#8f8f8f] py-2 px-4">Ничего не найдено</div>;

  return (
    <div className="p-4 text-[#8f8f8f]">
      Введите 2 и более символов для поиска
    </div>
  );
};

export default SearchResults;
