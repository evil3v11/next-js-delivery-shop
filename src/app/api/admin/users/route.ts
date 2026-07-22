import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { CONFIG } from "../../../../../config/config";
import { calculateAge } from "@/utils/admin/calculateAge";

import { getShortDecimalId } from "@/utils/admin/getShortDecimalId";
import { Filter, Document } from "mongodb";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || CONFIG.DEFAULT_PAGE_SIZE;
    const managerRegion = searchParams.get("managerRegion");
    const managerLocation = searchParams.get("managerLocation");
    const isManager = searchParams.get("isManager") === "true";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortDirection = searchParams.get("sortDirection") || "desc";

    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const lastName = searchParams.get("lastName");
    const email = searchParams.get("email");
    const phoneNumber = searchParams.get("phoneNumber");
    const role = searchParams.get("role");
    const minAge = searchParams.get("minAge");
    const maxAge = searchParams.get("maxAge");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const db = await getDB();

    const filter: Filter<Document> = {};

    if (isManager && managerRegion && managerLocation) {
      filter.region = managerRegion;
      filter.location = managerLocation;
    }

    if (id && id.trim() !== "") {
      const searchId = id.trim();

      const allUsersIds = await db
        .collection("user")
        .find({}, { projection: { _id: 1 } })
        .toArray();

      const matchingIds = allUsersIds
        .filter((user) => {
          const decimalId = getShortDecimalId(String(user._id));
          return decimalId.includes(searchId);
        })
        .map((user) => user._id);

      if (matchingIds.length > 0) {
        Object.assign(filter, { _id: { $in: matchingIds } });
      } else {
        Object.assign(filter, { _id: { $in: [] } });
      }
    }

    if (name && name.trim() !== "")
      Object.assign(filter, { name: { $regex: name, $options: "i" } });

    if (lastName && lastName.trim() !== "")
      Object.assign(filter, { lastName: { $regex: lastName, $options: "i" } });

    if (email && email.trim() !== "")
      Object.assign(filter, {
        email: {
          $regex: email,
          $options: "i",
          $not: { $regex: CONFIG.TEMP_EMAIL_DOMAIN },
        },
      });

    if (phoneNumber && phoneNumber.trim() !== "")
      Object.assign(filter, {
        phoneNumber: { $regex: phoneNumber, $options: "i" },
      });

    if (role && role !== "all") filter.role = role;

    if (minAge || maxAge) {
      const currentYear = new Date().getFullYear();
      const birthdayDateFilter: Record<string, Date> = {};

      if (minAge && minAge.trim() !== "") {
        const minAgeNum = Number(minAge);
        const maxBirthdayYear = currentYear - minAgeNum;
        birthdayDateFilter.$lte = new Date(
          `${maxBirthdayYear}-12-31T23:59:59.999Z`,
        );
      }

      if (maxAge && maxAge.trim() !== "") {
        const maxAgeNum = Number(maxAge);
        const minBirthdayYear = currentYear - maxAgeNum - 1;
        birthdayDateFilter.$gte = new Date(
          `${minBirthdayYear}-01-01T00:00:00.000Z`,
        );
      }

      Object.assign(filter, { birthdayDate: birthdayDateFilter });
    }

    const createdAtFilter: Record<string, Date> = {};

    if (startDate && startDate.trim() !== "")
      createdAtFilter.$gte = new Date(startDate);
    if (endDate && endDate.trim() !== "")
      createdAtFilter.$lte = new Date(endDate);

    if (Object.keys(createdAtFilter).length > 0)
      Object.assign(filter, { createdAt: createdAtFilter });

    const offset = (page - 1) * limit;

    const sortOptions: { [key: string]: 1 | -1 } = {};
    sortOptions[sortBy] = sortDirection === "asc" ? 1 : -1;

    if (sortBy === "age") {
      sortOptions.birthdayDate = sortDirection === "asc" ? 1 : -1;
    } else if (sortBy === "id") {
      sortOptions._id = sortDirection === "asc" ? 1 : -1;
    } else sortOptions[sortBy] = sortDirection === "asc" ? 1 : -1;

    const users = await db
      .collection("user")
      .find(filter)
      .sort(sortOptions)
      .skip(offset)
      .limit(limit)
      .toArray();

    if (sortBy === "id") {
      users.sort((a, b) => {
        const decimalA = Number(getShortDecimalId(String(a._id)));
        const decimalB = Number(getShortDecimalId(String(b._id)));
        return sortDirection === "asc"
          ? decimalA - decimalB
          : decimalB - decimalA;
      });
    }

    const totalCount = await db.collection("user").countDocuments(filter);

    const formattedUsers = users.map((u) => ({
      id: String(u._id),
      decimalId: getShortDecimalId(String(u._id)),
      name: u.name || "",
      lastName: u.lastName || "",
      age: calculateAge(u.birthdayDate),
      email: u.email || "",
      phoneNumber: u.phoneNumber || "",
      role: u.role || "user",
      birthdayDate: u.birthdayDate || "",
      region: u.region || "",
      location: u.location || "",
      gender: u.gender || "",
      card: u.card || "",
      hasCard: u.hasCard || false,
      createdAt: u.createdAt
        ? u.createdAt.toISOString()
        : new Date().toISOString(),
      updatedAt: u.updatedAt
        ? u.updatedAt.toISOString()
        : new Date().toISOString(),
      emailVerified: u.emailVerified || false,
      phoneVerified: u.phoneVerified || false,
    }));

    return NextResponse.json({
      users: formattedUsers,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (e) {
    console.error("Ошибка получения списка пользователей: ", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
