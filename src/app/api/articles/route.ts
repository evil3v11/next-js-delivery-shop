import { getDB } from "@/utils/api-routes";
import { NextResponse } from "next/server";
export const revalidate = 3600;

export const GET = async () => {
  try {
    const db = await getDB();
    const articles = await db.collection("articles").find().toArray();
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Server error", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
