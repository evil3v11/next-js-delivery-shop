export type CategoryForSitemap = { slug: string };

export type ProductForSitemap = {
  id: number;
  title: string;
  updatedAt?: string;
  categorySlug: CategoryForSitemap["slug"];
};

export interface SitemapDataResponse {
  categories: CategoryForSitemap[];
  products: ProductForSitemap[];
}
