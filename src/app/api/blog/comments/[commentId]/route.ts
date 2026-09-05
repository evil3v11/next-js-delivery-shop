import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import {
  ArticleComment,
  DeleteCommentResponse,
  PatchCommentResponse
} from "@/app/(blog)/blog/_types";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
): Promise<NextResponse<PatchCommentResponse>> => {
  try {
    const { commentId } = await params;
    const { content, userId } = await request.json();

    if (!content.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Комментарий не может быть пустым",
        },
        { status: 400 },
      );
    }

    const db = await getDB();

    const comment = await db
      .collection("comments")
      .findOne<ArticleComment>({ _id: new ObjectId(commentId) });

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          message: "Такого комментария не существует",
        },
        { status: 404 },
      );
    }

    if (comment.authorId !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Нет прав на редактирование комментария",
        },
        { status: 403 },
      );
    }

    if (comment.isDeleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Нельзя редактировать удаленный комментарий",
        },
        { status: 400 },
      );
    }

    const now = new Date();

    const updateResult = await db.collection("comments").updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          content: content.trim(),
          isEdited: true,
          editedAt: now,
          updatedAt: now,
        },
      },
    );

    if (!updateResult.modifiedCount) {
      return NextResponse.json(
        {
          success: false,
          message: "Такого комментария не существует",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Комментарий успешно изменен",
        data: {
          content: content.trim(),
          isEdited: true,
          editedAt: now.toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (e) {
    console.error("Ошибка при изменении комментария: ", e);
    return NextResponse.json(
      {
        success: false,
        message: `Ошибка при изменении комментария: ${e}`,
      },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ commentId: string }> },
): Promise<NextResponse<DeleteCommentResponse>> => {
  try {
    const { commentId } = await params;
    if (!commentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Нет данных об комментарии",
        },
        { status: 400 },
      );
    }

    const db = await getDB();

    const softDeleteResult = await db.collection("comments").updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          content: "[Комментарий удален]",
          isDeleted: true,
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );

    if (!softDeleteResult.modifiedCount) {
      return NextResponse.json(
        {
          success: false,
          message: "Такого комментария не существует",
        },
        { status: 404 },
      );
    }

    const updatedComment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(commentId) });

    if (!updatedComment) {
      return NextResponse.json(
        {
          success: false,
          message: "Такого комментария не существует",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Комментарий успешно удален",
        comment: {
          _id: String(updatedComment._id),
          content: updatedComment.content,
          isDeleted: updatedComment.isDeleted,
          deletedAt: updatedComment.deletedAt,
        },
      },
      { status: 200 },
    );
  } catch (e) {
    console.error("Ошибка при удалении комментария: ", e);
    return NextResponse.json(
      {
        success: false,
        message: `Ошибка при удалении комментария: ${e}`,
      },
      { status: 500 },
    );
  }
};
