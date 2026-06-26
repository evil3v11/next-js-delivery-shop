import { GenericListPageProps } from "@/types/genericListPageProps";
import { ProductCardProps } from "@/types/product";
import { ArticleCardProps } from "@/types/articles";
import { CONFIG } from "../../../config/config";

import ProductsSection from "./ProductsSection";
import ArticlesSection from "../(articles)/ArticlesSection";
import PaginationWrapper from "@/components/PaginationWrapper";

const GenericListPage = async ({
  searchParams,
  props,
}: {
  searchParams: Promise<{ page: string; itemsPerPage?: string }>;
  props: GenericListPageProps;
}) => {
  const params = await searchParams;
  const page = params?.page;
  const itemsPerPage = params?.itemsPerPage || CONFIG.ITEMS_PER_PAGE;

  const currentPage = Number(page) || 1;
  const perPage = Number(itemsPerPage);
  const startIdx = (currentPage - 1) * perPage;
  const items = await props.fetchData();
  const paginatedItems = items.slice(startIdx, startIdx + perPage);
  return (
    <>
      {!props.contentType ? (
        <ProductsSection
          title={props.pageTitle}
          viewAllBtn={{ text: "На главную", href: "/" }}
          products={paginatedItems as ProductCardProps[]}
        />
      ) : (
        <ArticlesSection
          title={props.pageTitle}
          viewAllBtn={{ text: "На главную", href: "/" }}
          articles={paginatedItems as ArticleCardProps[]}
        />
      )}

      {items.length >= perPage && (
        <PaginationWrapper
          totalItems={items.length}
          currentPage={currentPage}
          basePath={props.basePath}
          contentType={props.contentType}
        />
      )}
    </>
  );
};

export default GenericListPage;
