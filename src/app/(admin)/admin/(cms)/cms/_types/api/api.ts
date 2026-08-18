import { ApiResponse } from "@/types/api/default-response";
import { SiteSettings } from "../siteSettings";
import { Category } from "../entities";

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
