import { baseUrl } from "@/utils/baseUrl";
import { createSlug } from "@/utils/createSlug";
import { formatDateToString } from "@/utils/formatDateToString";
import { getSitemapData } from "@/utils/getSitemapData";
import { MetadataRoute } from "next";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const currentDate = formatDateToString(new Date());

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/actions`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/new`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  const data = await getSitemapData();

  const categoryPages: MetadataRoute.Sitemap = data.categories.map(
    (category) => ({
      url: `${baseUrl}/catalog/${category.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }),
  );

  const productsPages: MetadataRoute.Sitemap = data.products.map((product) => {
    const productSlug = createSlug(product.title, product.id);
    return {
      url: `${baseUrl}/catalog/${product.categorySlug}/${productSlug}`,
      lastModified: product.updatedAt
        ? formatDateToString(new Date(product.updatedAt))
        : currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    };
  });

  return [...staticPages, ...categoryPages, ...productsPages];
};

export default sitemap;
