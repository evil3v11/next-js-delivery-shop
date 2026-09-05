import { NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import { GetUserGenderResponse } from "@/types/api/comments";
import { UserData } from "@/types/userData";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
): Promise<NextResponse<GetUserGenderResponse>> => {
  try {
    const { userId } = await params;

    const db = await getDB();
    const userData = await db
      .collection("user")
      .findOne<UserData>(
        { _id: new ObjectId(userId) },
        { projection: { gender: 1, name: 1, lastName: 1 } },
      );

    if (!userData) {
      return NextResponse.json(
        {
          success: false,
          message: "Такого пользователя не существует",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Запрос успешно обработан",
        data: userData,
      },
      { status: 200 },
    );
  } catch (e) {
    console.error("Ошибка при запросе данных о пользователе: ", e);
    return NextResponse.json(
      {
        success: false,
        message: `Ошибка при запросе данных о пользователе: ${e}`,
      },
      { status: 500 },
    );
  }
};
