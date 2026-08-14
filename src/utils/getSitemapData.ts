import { baseUrl } from "./baseUrl";

import type { SitemapDataResponse } from "@/types/sitemap";

export const getSitemapData = async (): Promise<SitemapDataResponse> => {
  try {
    const response = await fetch(`${baseUrl}/api/sitemap-data`)
    if (!response.ok) console.error("Не удалось получить данные для карты сайта: ", response.status)
    const sitemapData: SitemapDataResponse = await response.json()
    return sitemapData
  } catch (e) {
    console.error("Не удалось получить данные для карты сайта: ", e)
    throw e
  }
}