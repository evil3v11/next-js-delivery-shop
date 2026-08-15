import { getDB } from "@/utils/api-routes";
import { NextRequest, NextResponse } from "next/server";
import { SiteSettings } from "../../_types/siteSettings";
import { ObjectId } from "mongodb";
import { ApiResponse } from "@/types/api/default-response";
import {
  GetSiteSettingsResponse,
  PutSiteSettingsResponse,
} from "../../_types/api";

export const GET = async (): Promise<
  NextResponse<GetSiteSettingsResponse | ApiResponse>
> => {
  try {
    const db = await getDB();
    const result = await db
      .collection<SiteSettings>("site-settings")
      .findOneAndUpdate(
        {},
        {
          $setOnInsert: {
            siteKeywords: ["ваш", "сайт", "ключевые", "слова"],
            semanticCore: ["основные", "тематики", "сайта"],
            metaDescription: "Описание вашего сайта",
            siteTitle: "Название вашего сайта",
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true, returnDocument: "after" },
      );

    if (!result) {
      const defaultSettings: SiteSettings = {
        _id: new ObjectId(),
        siteKeywords: ["ваш", "сайт", "ключевые", "слова"],
        semanticCore: ["основные", "тематики", "сайта"],
        metaDescription: "Описание вашего сайта",
        siteTitle: "Название вашего сайта",
        updatedAt: new Date().toISOString(),
      };

      await db
        .collection<SiteSettings>("site-settings")
        .insertOne(defaultSettings);

      return NextResponse.json(
        {
          success: true,
          data: {
            ...defaultSettings,
            _id: String(defaultSettings._id),
          },
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...result,
          _id: String(result._id),
        },
      },
      { status: 200 },
    );
  } catch (e) {
    console.log("Ошибка при получении настроек: ", e);
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка при получении настроек",
      },
      { status: 500 },
    );
  }
};

export const PUT = async (
  request: NextRequest,
): Promise<NextResponse<PutSiteSettingsResponse>> => {
  try {
    const data = await request.json();

    const db = await getDB();
    const result = await db
      .collection<SiteSettings>("site-settings")
      .findOneAndUpdate(
        {},
        {
          $set: {
            siteKeywords: data.siteKeywords || [],
            semanticCore: data.semanticCore || [],
            metaDescription: data.metaDescription || "",
            siteTitle: data.siteTitle || "",
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true, returnDocument: "after" },
      );

    return NextResponse.json(
      {
        success: true,
        message: result ? "Настройки обновлены" : "Настройки созданы",
        data: result
          ? {
              ...result,
              _id: String(result._id),
            }
          : null,
      },
      { status: 200 },
    );
  } catch (e) {
    console.log("Ошибка при сохранения настроек: ", e);
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка при сохранения настроек",
      },
      { status: 500 },
    );
  }
};
