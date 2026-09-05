import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import type {
  ArticleComment,
  LikeCommentResponse,
} from "@/app/(blog)/blog/_types";
import { ObjectId } from "mongodb";

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
): Promise<NextResponse<LikeCommentResponse>> => {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Вы не вошли в систему, только авторизованные пользователи могут оставлять лайки",
        },
        { status: 400 },
      );
    }

    const { commentId } = await params;

    const db = await getDB();
    const _id = new ObjectId(commentId);

    const comment = await db
      .collection("comments")
      .findOne<ArticleComment>({ _id });

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          message: "Такого комментария не существует",
        },
        { status: 404 },
      );
    }

    const likes = comment.likes;
    const hasLiked = likes.includes(userId);

    let newLikes;
    if (hasLiked) {
      newLikes = likes.filter((id) => id !== userId);
    } else {
      newLikes = [...likes, userId];
    }

    await db
      .collection("comments")
      .updateOne({ _id }, { $set: { likes: newLikes } });

    return NextResponse.json(
      {
        success: true,
        message: "Комментарий успешно лайкнут",
        data: {
          likeCount: newLikes.length,
          isLiked: !hasLiked,
        },
      },
      { status: 200 },
    );
  } catch (e) {
    console.error("Ошибка при оставлении лайка у комментария: ", e);
    return NextResponse.json(
      {
        success: false,
        message: `Ошибка при оставлении лайка у комментария: ${e}`,
      },
      { status: 500 },
    );
  }
};
