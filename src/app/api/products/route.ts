import { getDB } from "@/utils/api-routes";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'
export const revalidate = 3600;

export const GET = async (request: Request) => {
  try {
    const category = new URL(request.url).searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        { message: "Параметр категории обязателен" },
        { status: 400 },
      );
    }

    const promotionalProducts = await (await getDB())
      .collection("products")
      .find({ categories: category })
      .toArray();

    return NextResponse.json(promotionalProducts);
  } catch (error) {
    console.error("Server error", error);
    return NextResponse.json(
      { message: "Error fetching promotional products: " },
      { status: 500 },
    );
  }
};
