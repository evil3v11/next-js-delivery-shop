import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { Review } from "@/app/(catalog)/catalog/[category]/(product)/[slug]/_components/ProductsReviews";

export const dynamic = "force-dynamic";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
): Promise<NextResponse> => {
  try {
    const { productId } = await params;
    const db = await getDB();

    if (!productId)
      return NextResponse.json({ error: "Нет ID продукта" }, { status: 400 });

    const reviews = await db
      .collection<Review[]>("reviews")
      .find({ productId })
      .sort({ createdAt: -1 })
      .toArray();

    if (!reviews) {
      return NextResponse.json(
        { error: "Такого отзыва не существует" },
        { status: 404 },
      );
    }

    return NextResponse.json(reviews);
  } catch (e) {
    console.error("Произошла ошибка при запросе отзывов на товар");
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
): Promise<NextResponse> => {
  try {
    const { productId } = await params;
    const review = await request.json();

    const db = await getDB();

    if (!productId)
      return NextResponse.json({ error: "Нет ID продукта" }, { status: 400 });

    const exisitingReview = await db
      .collection("reviews")
      .findOne({ productId, userId: review.userId });

    if (exisitingReview) {
      return NextResponse.json(
        { error: "Вы уже оставляли отзыв" },
        { status: 400 },
      );
    }

    const product = await db
      .collection("products")
      .findOne({ id: Number(productId) });

    if (!product) {
      return NextResponse.json(
        { error: "Такого продукта не существует" },
        { status: 404 },
      );
    }

    const newDistribution: Record<string, number> = {
      ...product.rating.distribution,
    };
    newDistribution[review.rating] += 1;
    const newCount = product.rating.count + 1;
    const totalAverage = Object.values(newDistribution).reduce(
      (acc, curr, index) => acc + curr * (index + 1),
      0,
    );
    const newAverage = Math.round((totalAverage / newCount) * 10) / 10;
    
    await db.collection("products").updateOne(
      { id: Number(productId) },
      {
        $set: {
          "rating.distribution": newDistribution,
          "rating.count": newCount,
          "rating.rate": newAverage,
          updatedAt: new Date(),
        },
      },
    );

    const insertResult = await db.collection("reviews").insertOne({
      productId,
      ...review,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!insertResult.acknowledged) {
      return NextResponse.json(
        { error: "Ошибка при добавлении отзыва" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    console.error("Произошла ошибка при отправлении отзыва");
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
