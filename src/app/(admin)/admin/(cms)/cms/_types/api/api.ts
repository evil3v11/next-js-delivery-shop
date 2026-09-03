import { ApiResponse } from "@/types/api/default-response";
import { SiteSettings } from "../siteSettings";
import { BlogCategory } from "@/app/(blog)/blog/categories/_types/categories";
import { Article, Category } from "@/types/entities";

export type GetSiteSettingsResponse = {
  success: boolean;
  data: SiteSettings;
};

export type PutSiteSettingsResponse = ApiResponse & {
  data?: SiteSettings | null;
};

export type CreateCategoryResponse = ApiResponse & {
  data?: Category;
};

export type GetCategoriesResponse =
  | (Pick<ApiResponse, "success"> & {
      data: {
        categories: Category[];
        pagination?: {
          page: number;
          limit: number;
          totalItems: number;
          totalFilteredItems: number;
          totalPages: number;
        };
      };
      totalAmount: number;
    })
  | ApiResponse;

export type GetBlogCategoriesResponse =
  | (Pick<ApiResponse, "success"> & {
      data: BlogCategory[];
    })
  | ApiResponse;

export type FetchArticleResponse = ApiResponse & {
  data?: Article;
};

export type FetchArticlesResponse = ApiResponse & {
  data?: {
    articles: Article[];
    totalAmount: number;
    pagination: {
      totalFilteredItems: number;
      totalPages: number;
    };
  };
};

export type CreateArticleResponse = ApiResponse & {
  data?: Article;
};
