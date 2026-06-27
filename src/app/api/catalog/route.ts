import { CatalogProps } from "@/types/catalog";
import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
export const revalidate = 3600;

export const GET = async () => {
  try {
    const db = await getDB();
    const catalog = await db.collection("catalog").find().toArray();
    return NextResponse.json(catalog);
  } catch (error) {
    console.error("Ошибка при получении категории:", error);
    return NextResponse.json(
      { message: "Ошибка при получении категории" },
      { status: 500 },
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const db = await getDB();
    const updatedCategories: CatalogProps[] = await request.json();

    const bulkOps = updatedCategories.map((category) => ({
      updateOne: {
        filter: { _id: new ObjectId(category._id) },
        update: {
          $set: {
            order: category.order,
            title: category.title,
            img: category.img,
            colSpan: category.colSpan,
            tabletColSpan: category.tabletColSpan,
            mobileColSpan: category.mobileColSpan,
          },
        },
      },
    }));

    const result = await db.collection("catalog").bulkWrite(bulkOps);

    return NextResponse.json({
      success: true,
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Ошибка при обновлении порядка категорий: ", error);
    return NextResponse.json(
      { message: "Ошибка при обновлении порядка категорий" },
      { status: 500 },
    );
  }
};
