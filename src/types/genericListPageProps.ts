import { ArticleCardProps } from "./articles";
import { ProductCardProps } from "./product";

type ContentItem = ProductCardProps | ArticleCardProps;

interface PaginatedResponse<T> {
  products: T[];
  totalCount: number;
}

export interface GenericListPageProps {
  fetchData: (options: {
    pagination: { startIdx: number; perPage: number };
  }) => Promise<PaginatedResponse<ContentItem>>;
  pageTitle?: string;
  basePath: string;
  contentType?: string;
}
