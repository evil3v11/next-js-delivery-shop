import { ApiResponse } from "@/types/api/default-response";
import { SiteSettings } from "./siteSettings";

export type GetSiteSettingsResponse = {
  success: boolean;
  data: SiteSettings;
};

export type PutSiteSettingsResponse = ApiResponse & {
  data?: SiteSettings | null;
};
