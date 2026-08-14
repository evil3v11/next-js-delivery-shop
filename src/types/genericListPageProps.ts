import { Article } from "./articles";
import { Product } from "./product";

type ContentItem = Product | Article;

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
