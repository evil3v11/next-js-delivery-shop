import { getDB } from "@/utils/api-routes";
import { CONFIG } from "../../../../../../config/config";
import { Article } from "@/types/entities";

export const getRelatedArticles = async (
  categoryId: string,
  excludeSlug: string,
  limit: number = CONFIG.RELATED_ARTICLES_PER_ARTICLE,
): Promise<Article[]> => {
  try {
    const db = await getDB();

    const relatedArticles = await db
      .collection<Article>("articles")
      .find(
        {
          categoryId: String(categoryId),
          slug: { $ne: excludeSlug },
          status: { $in: ["published"] },
        },
        {
          projection: {
            _id: 1,
            name: 1,
            slug: 1,
            description: 1,
            image: 1,
            imageAlt: 1,
            views: 1,
            publishedAt: 1,
            createdAt: 1,
            author: 1,
            keywords: 1,
          },
        },
      )
      .sort({ publishedAt: -1 })
      .limit(limit)
      .toArray();

    return relatedArticles.map((a) => ({ ...a, _id: String(a._id) }));
  } catch (e) {
    console.error("Ошибка при получении похожих статей: ", e);
    return [];
  }
};
