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

    const dbCategories = await db
      .collection("catalog")
      .find({})
      .project({ slug: 1 })
      .sort({ order: 1 })
      .toArray();

    const dbProducts = await db
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
      .limit(10000)
      .toArray();

    const categories: CategoryForSitemap[] = dbCategories.map((category) => ({
      slug: category.slug,
    }));

    const products: ProductForSitemap[] = dbProducts.map((product) => ({
      id: product.id,
      title: product.title || "",
      updatedAt: product.updateAt,
      categorySlug: product.categories?.[0] || "other",
    }));

    return NextResponse.json({ categories, products });
  } catch (e) {
    console.error("Sitemap data error: ", e);
    return NextResponse.json(
      { success: false, message: "Failed to generate sitemap data" },
      { status: 500 },
    );
  }
};
