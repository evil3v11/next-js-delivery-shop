import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";

import { buildSortObject } from "../../_utils/buildSortObject";
import { buildFilterQuery } from "../../_utils/buildFilterQuery";

import { ObjectId } from "mongodb";
import type { Category } from "../../../../../../../types/entities";
import type { CategoryFilterType, SortDirection, CategorySortField } from "@/types/filters";
import type {
  CreateCategoryResponse,
  GetCategoriesResponse,
} from "../../_types";

export const GET = async (
  request: NextRequest,
): Promise<NextResponse<GetCategoriesResponse>> => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit"))
    const sortBy = (searchParams.get("sortBy") as CategorySortField) || "numericId";
    const sortOrder = (searchParams.get("sortOrder") as SortDirection) || "asc";
    const query = searchParams.get("query") || "";
    const filterBy = (searchParams.get("filterBy") as CategoryFilterType) || "all";

    const validPage = Math.max(1, page);
    const validLimit = limit ? Math.max(1, Math.min(limit, 100)) : 100;

    const skip = (validPage - 1) * validLimit;

    const sortObject = buildSortObject(sortBy, sortOrder);
    const filterQuery = buildFilterQuery(query, filterBy);

    const db = await getDB();
    const categories = await db
      .collection<Category>("article-category")
      .find({})
      .filter(filterQuery)
      .sort(sortObject)
      .skip(skip)
      .limit(validLimit)
      .toArray();

    const totalAmount = await db
      .collection("article-category")
      .countDocuments({});

    const totalFiltered = await db
      .collection("article-category")
      .countDocuments(filterQuery);

    const totalPages = Math.ceil(totalFiltered / validLimit);

    return NextResponse.json(
      {
        success: true,
        data: {
          categories: categories.map((c) => ({ ...c, _id: String(c._id) })),
          pagination: {
            page: validPage,
            limit: validLimit,
            totalItems: totalAmount,
            totalFilteredItems: totalFiltered,
            totalPages,
          },
        },
        totalAmount,
      },
      { status: 200 },
    );
  } catch (e) {
    console.error(
      "Ошибка при обработке запроса о получении категорий статей: ",
      e,
    );
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка при обработке запроса о получении категорий статей",
      },
      { status: 500 },
    );
  }
};

export const POST = async (
  request: NextRequest,
): Promise<NextResponse<CreateCategoryResponse>> => {
  try {
    const data: Category = await request.json();

    if (!data.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Нет названия категории" },
        { status: 400 },
      );
    }

    if (!data.slug?.trim()) {
      return NextResponse.json(
        { success: false, message: "Нет slug'а категории" },
        { status: 400 },
      );
    }

    const name = data.name.trim();
    const slug = data.slug.trim().toLowerCase();

    const db = await getDB();
    const existingCategory = await db
      .collection<Category>("article-category")
      .findOne({ slug });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Такое slug категории уже существует" },
        { status: 400 },
      );
    }

    const result = await db
      .collection("article-category")
      .aggregate([
        {
          $group: {
            _id: null,
            maxNumericId: { $max: "$numericId" },
          },
        },
      ])
      .toArray();

    let maxNumericId = 0;
    if (
      result.length > 0 &&
      result[0].maxNumericId !== null &&
      result[0].maxNumericId !== undefined
    ) {
      maxNumericId = result[0].maxNumericId;
    }

    const newNumericId = maxNumericId + 1;

    const newCategory = {
      _id: new ObjectId(),
      numericId: newNumericId,
      name,
      slug,
      description: data.description.trim() || "",
      keywords: data.keywords || [],
      image: data.image || "",
      imageAlt: data.imageAlt || data.name,
      author: data.author || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      numberOfArticles: 0,
    };

    await db.collection("article-category").insertOne(newCategory);

    const responseCategory = {
      ...newCategory,
      _id: String(newCategory._id),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Категория успешно создана",
        data: responseCategory,
      },
      { status: 201 },
    );
  } catch (e) {
    console.error("Ошибка при создании новой категории: ", e);
    return NextResponse.json(
      { success: false, message: "Ошибка при создании новой категории" },
      { status: 500 },
    );
  }
};
