import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { CMS_CONFIG } from "../../cms_config";
import {
  CommentFilter,
  GetCommentsWithPaginationResponse,
} from "../../comments/_types";
import { ObjectId } from "mongodb";
import { Article } from "@/types/entities";
import { ArticleComment } from "@/app/(blog)/blog/_types";

export const GET = async (
  request: NextRequest,
): Promise<NextResponse<GetCommentsWithPaginationResponse>> => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || CMS_CONFIG.COMMENTS_PER_PAGE;
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const author = searchParams.get("author");
    const article = searchParams.get("article");

    const validPage = Math.max(1, page);
    const validLimit = limit ? Math.max(1, Math.min(limit, 100)) : 100;

    const skip = (validPage - 1) * validLimit;

    const db = await getDB();

    let articleIds: string[] = [];
    if (article) {
      const articles = await db
        .collection("article")
        .find({
          name: { $regex: article, $options: "i" },
        })
        .project({ _id: 1, name: 1 })
        .toArray();

      articleIds = articles.map((a) => String(a._id));
      if (!articleIds.length) {
        console.error("Статьи не найдены");
        return NextResponse.json({
          success: false,
          message: "Статьи не найдены",
          data: {
            comments: [],
            totalPages: 0,
            totalFilteredItems: 0,
            totalAllItems: await db.collection("comments").countDocuments(),
          },
        });
      }
    }

    const filter: CommentFilter = {};

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        filter.createdAt.$gte = fromDate;
      }

      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = toDate;
      }
    }

    if (author) filter.authorName = { $regex: author, $options: "i" };
    if (articleIds.length > 0) filter.articleId = { $in: articleIds };

    const [comments, totalFilteredItems, totalAllItems] = await Promise.all([
      db
        .collection<ArticleComment>("comments")
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(validLimit)
        .toArray(),
      db.collection("comments").countDocuments(filter),
      db.collection("comments").countDocuments(),
    ]);

    const uniqueArticleIds = Array.from(
      new Set(comments.map((c) => c.articleId)),
    );
    const articles = await db
      .collection("articles")
      .find<Article>({
        _id: {
          $in: uniqueArticleIds.map((id) => new ObjectId(id)),
        },
      })
      .toArray();

    const map = new Map<string, Article>();
    for (const article of articles) {
      map.set(String(article._id), article);
    }

    const formattedComments = comments.map((c) => ({
      ...c,
      _id: String(c._id),
      articleName: map.get(c.articleId)?.name ?? "Статья удалена",
      articleSlug: map.get(c.articleId)?.slug ?? "",
      categorySlug: map.get(c.articleId)?.categorySlug ?? "",
      createdAt: c.createdAt,
    }));

    const totalPages = Math.ceil(totalFilteredItems / validLimit);

    return NextResponse.json({
      success: true,
      message: "Запрос успешно обработан",
      data: {
        comments: formattedComments,
        page: validPage,
        limit: validLimit,
        totalAllItems,
        totalFilteredItems,
        totalPages,
      },
    });
  } catch (e) {
    console.error("Ошибка при получении комментариев: ", e);
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка при получении комментариев",
        data: {
          comments: [],
          totalPages: 0,
          totalFilteredItems: 0,
          totalAllItems: 0,
        },
      },
      { status: 500 },
    );
  }
};
