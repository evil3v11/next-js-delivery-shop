import Link from "next/link";

import { CatalogMenuProps } from "@/types/catalogMenuProps";

import SearchBlock from "../SearchBlock";
import ErrorComponent from "@/components/ErrorComponent";
import MiniLoader from "@/components/MiniLoader";

const CatalogMenu = ({
  isLoading,
  isCatalogOpen,
  setIsCatalogOpen,
  categories,
  error,
  searchBlockRef,
  menuRef,
  onFocusChangeAction,
  onMouseEnter,
}: CatalogMenuProps) => {
  return (
    <>
      <div
        className="flex items-center w-full"
        onMouseEnter={onMouseEnter}
        ref={searchBlockRef}
      >
        <SearchBlock onFocusChangeAction={onFocusChangeAction} />
      </div>

      {isCatalogOpen && (
        <div
          className="hidden md:block absolute top-full left-0 w-full px-[max(12px,calc((100%-1208px)/2))] 
          bg-white shadow-catalog-menu z-50"
          ref={menuRef}
          onMouseLeave={() => setIsCatalogOpen(false)}
        >
          <div className="mx-auto px-4 py-3">
            {error && (
              <ErrorComponent
                error={error.error}
                userMessage={error.userMessage}
              />
            )}
            {isLoading ? (
              <MiniLoader />
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                {categories.map(({ slug, title }) => (
                  <Link
                    key={slug}
                    href={`/category/${slug}`}
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
    </>
  );
};

export default CatalogMenu;
