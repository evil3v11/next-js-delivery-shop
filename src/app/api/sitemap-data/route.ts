import { NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";

import type { ApiResponse } from "@/types/api/default-response";
import type {
  CategoryForSitemap,
  ProductForSitemap,
  SitemapDataResponse,
} from "@/types/sitemap";

export const dynamic = "force-dynamic";

export const GET = async (): Promise<
  NextResponse<SitemapDataResponse | ApiResponse>
> => {
  try {
    const db = await getDB();

    const [dbCategories, dbProducts, dbArticleCategories, dbArticles] =
      await Promise.all([
        db
          .collection("catalog")
          .find({})
          .project({ slug: 1 })
          .sort({ order: 1 })
          .toArray(),

        db
          .collection("products")
          .find(
            { quantity: { $gt: 0 } },
            {
              projection: {
                id: 1,
                title: 1,
                updatedAt: 1,
                categories: 1,
              },
            },
          )
          .limit(30000)
          .toArray(),

        db
          .collection("article-category")
          .find({})
          .project({ slug: 1, updatedAt: 1 })
          .sort({ name: 1 })
          .toArray(),

        db
          .collection("articles")
          .find(
            { status: "published" },
            {
              projection: {
                slug: 1,
                name: 1,
                categorySlug: 1,
                publishedAt: 1,
                updatedAt: 1,
              },
            },
          )
          .sort({ publishedAt: -1 })
          .toArray(),
      ]);

    const categories: CategoryForSitemap[] = dbCategories.map((category) => ({
      slug: category.slug,
    }));

    const products: ProductForSitemap[] = dbProducts.map((product) => ({
      id: product.id,
      title: product.title || "",
      updatedAt: product.updateAt,
      categorySlug: product.categories?.[0] || "other",
    }));

    const articleCategories = dbArticleCategories.map((category) => ({
      slug: category.slug,
      updatedAt: category.updatedAt,
    }));

    const articles = dbArticles.map((article) => ({
      slug: article.slug,
      name: article.name || "",
      categorySlug: article.categorySlug,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
    }));

    return NextResponse.json({
      categories,
      products,
      articleCategories,
      articles,
    });
  } catch (e) {
    console.error("Sitemap data error: ", e);
    return NextResponse.json(
      { success: false, message: "Failed to generate sitemap data" },
      { status: 500 },
    );
  }
};
