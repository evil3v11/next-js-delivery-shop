import { unstable_cache } from "next/cache";
import { getDB } from "../api-routes";
import { baseUrl } from "../baseUrl";

import type { SiteSettings } from "@/app/(admin)/admin/(cms)/cms/_types/siteSettings";

export type SiteMetadata = {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
};

export const getSiteMetadata = unstable_cache(
  async (): Promise<SiteMetadata> => {
    const defaultMetadata: SiteMetadata = {
      title: "Северяночка",
      description: "Доставка и покупка продуктов питания",
      keywords: "доставка, продукты, питание",
      ogImage: `${baseUrl}/og-image.jpg`,
    };

    try {
      const db = await getDB();
      const settings = await db.collection<SiteSettings>("site-settings").findOne({});

      if (!settings) return defaultMetadata;

      return {
        title: settings.siteTitle || defaultMetadata.title,
        description: settings.metaDescription || defaultMetadata.description,
        keywords: Array.isArray(settings.semanticCore)
          ? settings.semanticCore.join(", ")
          : defaultMetadata.keywords,
        ogImage: `${baseUrl}/og-image.jpeg`,
      };
    } catch (e) {
      console.error("Ошибка обращения к БД для SEO: ", e);
      return defaultMetadata;
    }
  },
  ["site-metadata"],
  { revalidate: 86400 },
);
