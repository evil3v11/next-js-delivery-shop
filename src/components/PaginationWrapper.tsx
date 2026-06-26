"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { CONFIG } from "../../config/config";
import { debounce } from "@/utils/debounce";

import Pagination from "./Pagination";

const getItemsPerPageByWidth = (contentType?: string): number => {
  const width = window.innerWidth;
  if (contentType) {
    return width < 640 ? 2 : 3;
  }
  if (width < 768) {
    return 2;
  }

  if (width < 1280) {
    return 3;
  }
  return 4;
};

const PaginationWrapper = ({
  totalItems,
  currentPage,
  basePath,
  contentType,
}: {
  totalItems: number;
  currentPage: number;
  basePath: string;
  contentType?: string;
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(
    contentType === "articles" ? 1 : CONFIG.ITEMS_PER_PAGE,
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const updateItemsPerPage = () => {
      const newItemsPerPage = getItemsPerPageByWidth(contentType);
      if (newItemsPerPage === itemsPerPage) return;
      setItemsPerPage(newItemsPerPage);

      const params = new URLSearchParams(String(searchParams));
      params.set("itemsPerPage", String(newItemsPerPage));
      params.set("page", "1");

      router.replace(`${basePath}?${params.toString()}`, { scroll: false });
    };
    
    updateItemsPerPage();

    const handleResize = debounce(updateItemsPerPage, 200);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [itemsPerPage, searchParams, basePath, router, contentType]);
  return (
    <Pagination
      totalItems={totalItems}
      currentPage={currentPage}
      basePath={basePath}
      itemsPerPage={itemsPerPage}
      searchQuery={String(searchParams)}
    />
  );
};

export default PaginationWrapper;
