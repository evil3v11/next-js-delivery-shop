import { getDB } from "@/utils/api-routes";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (request: Request) => {
  try {
    const {
      phoneNumber,
      name,
      lastName,
      password,
      birthdayDate,
      region,
      location,
      gender,
      card,
      hasNoCard,
      email,
    } = await request.json();

    const db = await getDB();

    const existingUser = await db.collection("users").findOne({ phoneNumber });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "Пользователь с таким телефон уже существует",
        },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({
      phoneNumber,
      name,
      lastName,
      password: hashedPassword,
      birthdayDate: new Date(birthdayDate),
      region,
      location,
      gender,
      email,
      card,
      hasNoCard,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        userId: result.insertedId,
        user: {
          phoneNumber,
          lastName,
          name,
          email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Ошибка регистрации: ", error);
    return NextResponse.json(
      {
        error: "Ошибка сервера",
      },
      { status: 500 },
    );
  }
};
