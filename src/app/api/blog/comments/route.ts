import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import type {
  ArticleComment,
  PostCommentResponse,
} from "@/app/(blog)/blog/_types";

export const GET = async (
  request: NextRequest,
): Promise<NextResponse<ArticleComment[]>> => {
  try {
    const articleId = request.nextUrl.searchParams.get("articleId");
    if (!articleId) {
      return NextResponse.json([]);
    }

    const db = await getDB();

    const comments = await db
      .collection<ArticleComment>("comments")
      .find({ articleId })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedComments = comments.map((c) => ({
      ...c,
      _id: String(c._id),
      createdAt:
        c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
      updatedAt:
        c.updatedAt instanceof Date ? c.updatedAt.toISOString() : c.updatedAt,
    }));

    return NextResponse.json(formattedComments);
  } catch (e) {
    console.error("Ошибка при получении комментариев: ", e);
    return NextResponse.json([]);
  }
};

export const POST = async (
  request: NextRequest,
): Promise<NextResponse<PostCommentResponse>> => {
  try {
    const { articleId, parentId, content, authorId, authorName, authorRole } = await request.json();
    if (!articleId || !content || !authorId || !authorName || !authorRole) {
      return NextResponse.json(
        {
          success: false,
          message: "Не хватает данных для создания комментария",
        },
        { status: 400 },
      );
    }

    const db = await getDB();

    const newComment = {
      articleId,
      parentId: parentId || null,
      content: content.trim(),
      authorId,
      authorName,
      authorRole,
      likes: [],
      isEdited: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("comments").insertOne(newComment);
    return NextResponse.json(
      {
        success: true,
        message: "Комментарий успешно создан",
        data: {
          ...newComment,
          _id: String(result.insertedId),
          createdAt: String(newComment.createdAt),
          updatedAt: String(newComment.updatedAt),
          replies: [],
        },
      },
      { status: 201 },
    );
  } catch (e) {
    console.error("Ошибка при создании комментария: ", e);
    return NextResponse.json(
      {
        success: false,
        message: `Ошибка при создании комментария: ${e}`,
      },
      { status: 500 },
    );
  }
};
