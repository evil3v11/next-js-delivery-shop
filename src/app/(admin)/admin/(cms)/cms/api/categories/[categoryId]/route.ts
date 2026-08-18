import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";

import type { ApiResponse } from "@/types/api/default-response";

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
): Promise<NextResponse<ApiResponse>> => {
  try {
    const { categoryId } = await params;
    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: "Нет ID категории для удаления" },
        { status: 400 },
      );
    }

    if (!ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, message: "Неправильный ID категорий" },
        { status: 400 },
      );
    }

    const updateData = await request.json();
    if (!updateData.name.trim()) {
      return NextResponse.json(
        { success: false, message: "Название категории обязательно" },
        { status: 400 },
      );
    }

    if (!updateData.slug.trim()) {
      return NextResponse.json(
        { success: false, message: "Slug категории обязателен" },
        { status: 400 },
      );
    }

    const id = new ObjectId(categoryId);

    const db = await getDB();

    const exisitingCategoryWithSlug = await db
      .collection("article-category")
      .findOne({
        _id: { $ne: id },
        slug: updateData.slug.trim().toLowerCase(),
      });

    if (exisitingCategoryWithSlug) {
      return NextResponse.json(
        { success: false, message: "Категория с таким slug уже существует" },
        { status: 400 },
      );
    }

    const processKeywords = (keywords: unknown): string[] => {
      if (!keywords) return []

      if (Array.isArray(keywords)) {
        return keywords
          .map(k => (typeof k === 'string') ? k.trim() : String(k).trim())
          .filter(k => k.length > 0)
      }

      return []
    }

    // if field exists in the incoming JSON then the field becomes available in this object
    const updateFields = {
      name: updateData.name.trim(),
      slug: updateData.slug.trim(),
      updatedAt: new Date().toISOString(),
      ...(updateData.description && { description: updateData.description.trim() }),
      ...(updateData.keywords && { keywords: processKeywords(updateData.keywords) }),
      ...(updateData.image && { image: updateData.image }),
      ...(updateData.imageAlt && { imageAlt: updateData.imageAlt.trim() }),
    }

    const updateResult = await db
      .collection("article-category")
      .updateOne({ _id: id }, { $set: updateFields });

    if (!updateResult.modifiedCount) {
      return NextResponse.json(
        { success: false, message: "Такой категории не существует" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Категория успешно обновлена" },
      { status: 200 },
    );
  } catch (e) {
    console.error("Ошибка при обновлении категории для статей: ", e);
    return NextResponse.json(
      { success: false, message: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  _request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
): Promise<NextResponse<ApiResponse>> => {
  try {
    const { categoryId } = await params;
    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: "Нет ID категории для удаления" },
        { status: 400 },
      );
    }

    if (!ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, message: "Неправильный ID категорий" },
        { status: 400 },
      );
    }

    const id = new ObjectId(categoryId);

    const db = await getDB();
    const amountOfArticles = await db
      .collection("articles")
      .countDocuments({ category: id });

    if (amountOfArticles > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Невозможно удалить категорию. В ней содержится ${amountOfArticles} статей. Перед удалением категории необходимо перенести статьи в другую категорию`,
        },
        { status: 400 },
      );
    }

    const deleteResult = await db
      .collection("article-category")
      .deleteOne({ _id: id });

    if (!deleteResult.deletedCount) {
      return NextResponse.json(
        { success: false, message: "Такой категории не существует" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Категория успешно удалена" },
      { status: 200 },
    );
  } catch (e) {
    console.error("Ошибка при удалении категории для статей: ", e);
    return NextResponse.json(
      { success: false, message: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
