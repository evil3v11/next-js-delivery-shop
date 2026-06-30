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
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
  props: GenericListPageProps;
}) => {
  const params = await searchParams;
  const page = params?.page;

  const defaultItemsPerPage =
    props.contentType === "category"
      ? CONFIG.ITEMS_PER_PAGE_CATEGORY
      : CONFIG.ITEMS_PER_PAGE;
  const itemsPerPage = params?.itemsPerPage || defaultItemsPerPage;

  const currentPage = Number(page) || 1;
  const perPage = Number(itemsPerPage);
  const startIdx = (currentPage - 1) * perPage;

  const { items, totalCount } = await props.fetchData({
    pagination: { startIdx, perPage },
  });

  const totalPage = Math.ceil(totalCount / perPage);
  return (
    <>
      {!props.contentType || props.contentType === "category" ? (
        <ProductsSection
          title={props.pageTitle}
          products={items as ProductCardProps[]}
          applyIndexStyle={props.contentType === "category" ? false : true}
          contentType={props.contentType}
        />
      ) : (
        <ArticlesSection
          title={props.pageTitle}
          articles={items as ArticleCardProps[]}
        />
      )}

      {totalPage > 1 && (
        <PaginationWrapper
          totalItems={totalCount}
          currentPage={currentPage}
          basePath={props.basePath}
          contentType={props.contentType}
        />
      )}
    </>
  );
};

export default GenericListPage;
