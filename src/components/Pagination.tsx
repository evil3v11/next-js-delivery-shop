"use client";

import { PaginationProps } from "@/types/paginationProps";
import Link from "next/link";

const createPageUrl = (
  basePath: string,
  params: URLSearchParams,
  page: number,
): string => {
  const newParams = new URLSearchParams(params);
  newParams.set("page", String(page));
  return `${basePath}?${String(newParams)}`;
};

const getVisiblePages = (totalPages: number, currentPage: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let start: number = Math.max(1, currentPage - 2);
  let end: number = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) end = 5;
  else if (currentPage >= totalPages - 2) start = totalPages - 4;

  const pages: (number | string)[] = [];

  if (start > 1) pages.push(1);

  if (start > 2) pages.push("...");

  for (let i = start; i <= end; i++) pages.push(i);

  if (end < totalPages - 1) pages.push("...");

  if (end < totalPages) pages.push(totalPages);
  
  return pages;
};

const Pagination = ({
  totalItems,
  currentPage,
  basePath,
  itemsPerPage,
  searchQuery,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const params = new URLSearchParams(searchQuery);
  const visiblePages = getVisiblePages(totalPages, currentPage);

  const buttonBase ="w-5.5 h-5.5 md:w-10 md:h-10 flex items-center justify-center rounded duration-300 text-[#ff6633]";
  const buttonActive = "bg-[#ff6633] text-white hover:bg-primary";
  const buttonDisabled = "opacity-50 cursor-not-allowed";
  const pageButtonClass = `border border-[#ff6633] ${buttonBase}`;

  return (
    <div className="flex justify-center mt-10 mb-20 text-white text-sm md:text-base">
      <nav className="flex gap-1 md:gap-2 items-center">
        <Link
          href={createPageUrl(basePath, params, 1)}
          className={`${pageButtonClass} ${currentPage === 1 ? buttonDisabled : buttonActive}`}
          aria-disabled={currentPage === 1}
          tabIndex={currentPage === 1 ? -1 : undefined}
        >
          &laquo;
        </Link>
        <Link
          href={createPageUrl(basePath, params, currentPage - 1)}
          className={`${pageButtonClass} ${currentPage === 1 ? buttonDisabled : buttonActive}`}
          aria-disabled={currentPage === 1}
          tabIndex={currentPage === 1 ? -1 : undefined}
        >
          &lsaquo;
        </Link>
        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className={pageButtonClass}>
                ...
              </span>
            );
          }

          return (
            <Link
              key={page}
              href={createPageUrl(basePath, params, Number(page))}
              className={`${pageButtonClass} ${page === currentPage ? buttonActive : "hover:bg-[#ff6633]/25"}`}
            >
              {page}
            </Link>
          );
        })}
        <Link
          href={createPageUrl(basePath, params, currentPage + 1)}
          className={`${pageButtonClass} ${currentPage === totalPages ? buttonDisabled : buttonActive}`}
          aria-disabled={currentPage === totalPages}
          tabIndex={currentPage === totalPages ? -1 : undefined}
        >
          &rsaquo;
        </Link>
        <Link
          href={createPageUrl(basePath, params, totalPages)}
          className={`${pageButtonClass} ${currentPage === totalPages ? buttonDisabled : buttonActive}`}
          aria-disabled={currentPage === totalPages}
          tabIndex={currentPage === totalPages ? -1 : undefined}
        >
          &raquo;
        </Link>
      </nav>
    </div>
  );
};

export default Pagination;
