import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { CARDS_CONFIG } from "@/app/(admin)/admin/cards/_utils/CARDS_CONFIG";

type CardFilter = {
  isActive?: boolean;
  cardNumber?: { $regex: string; $options: string };
};

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = Number(searchParams.get("page")) ?? 1;
    const limit =
      Number(searchParams.get("limit")) ?? CARDS_CONFIG.ITEMS_PER_PAGE;
    const filter = searchParams.get("filter") ?? "all";
    const searchCardNumber = searchParams.get("searchCardNumber") ?? "";
    const searchOwner = searchParams.get("searchOwner") ?? "";

    const db = await getDB();

    let userIds: string[] = [];
    if (searchOwner) {
      const users = await db
        .collection("user")
        .find({
          $or: [
            { name: { $regex: searchOwner, $options: "i" } },
            { lastName: { $regex: searchOwner, $options: "i" } },
            { phoneNumber: { $regex: searchOwner, $options: "i" } },
          ],
        })
        .project({ _id: 1 })
        .toArray();

      userIds = users.map((u) => String(u._id));

      if (!userIds.length) {
        return NextResponse.json({
          cards: [],
          totalPage: 0,
          totalItems: 0,
          totalAllItems: await db.collection("cards").countDocuments(),
        });
      }
    }

    const cardFilter: CardFilter = {};

    if (filter === "active") cardFilter.isActive = true;
    else if (filter === "inactive") cardFilter.isActive = false;

    if (searchCardNumber) {
      const cleanSearch = searchCardNumber.replace(/\s/g, "");
      cardFilter.cardNumber = { $regex: cleanSearch, $options: "i" };
    }

    const allCards = await db
      .collection("cards")
      .find(cardFilter)
      .sort({ order: 1 })
      .toArray();

    const cardsWithOwners = await Promise.all(
      allCards.map(async (card) => {
        const user = await db
          .collection("user")
          .findOne({ card: card.cardNumber });

        return {
          ...card,
          _id: String(card._id),
          owner: user
            ? {
                id: String(user._id),
                name: user.name,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
              }
            : null,
        };
      }),
    );

    let filteredCards = cardsWithOwners;
    if (filter === "free")
      filteredCards = cardsWithOwners.filter((c) => !c.owner);
    if (filter === "assigned")
      filteredCards = cardsWithOwners.filter((c) => c.owner);
    if (searchOwner && userIds.length > 0) {
      filteredCards = cardsWithOwners.filter(
        (c) => c.owner && userIds.includes(c.owner.id),
      );
    }

    const totalAllFilteredItems = filteredCards.length;
    const totalAllItems = await db.collection("cards").countDocuments();
    const skip = (page - 1) * limit;
    const paginatedCards = filteredCards.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      message: "Запрос обработан успешно",
      data: {
        cards: paginatedCards,
        totalPages: Math.ceil(totalAllFilteredItems / limit),
        totalAllFilteredItems,
        totalAllItems,
        currentPage: page,
      },
    });
  } catch (e) {
    console.error(`Ошибка при получении карт лояльности: ${e}`);
    return NextResponse.json(
      {
        success: false,
        message: `Ошибка при получении карт лояльности: ${e}`,
      },
      { status: 500 },
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { cardNumber } = await request.json();
    if (!cardNumber || !/^\d{16}$/.test(cardNumber)) {
      return NextResponse.json(
        {
          success: false,
          message: "Номер карты должен содержать 16 цифр",
        },
        { status: 400 },
      );
    }

    const db = await getDB();

    const existingCard = await db.collection("cards").findOne({ cardNumber });
    if (existingCard) {
      return NextResponse.json(
        {
          success: false,
          message: "Карта с таким номером уже существует",
        },
        { status: 400 },
      );
    }

    const lastCard = await db
      .collection("cards")
      .find()
      .sort({ order: -1 })
      .limit(1)
      .toArray();
    const nextOrder = lastCard.length > 0 ? lastCard[0].order + 1 : 1;

    const newCard = {
      cardNumber,
      order: nextOrder,
      createdAt: new Date(),
      isActive: false,
    };

    const result = await db.collection("cards").insertOne(newCard);

    return NextResponse.json(
      {
        success: true,
        message: "Карта успешно добавлена",
        card: { ...newCard, _id: result.insertedId, owner: null },
      },
      { status: 201 },
    );
  } catch (e) {
    console.error(`Ошибка при добавлении карты лояльности: ${e}`);
    return NextResponse.json(
      {
        success: false,
        message: `Ошибка при добавлении карты лояльности: ${e}`,
      },
      { status: 500 },
    );
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cardNumber = searchParams.get("cardNumber");
    const action = searchParams.get("action");
    if (!cardNumber || !action) {
      return NextResponse.json(
        {
          success: false,
          message: "Неправильно указан номер карты или действие",
        },
        { status: 400 },
      );
    }

    const db = await getDB();

    const card = await db.collection("cards").findOne({ cardNumber });
    if (!card) {
      return NextResponse.json(
        {
          success: false,
          message: "Такой карты не существует",
        },
        { status: 404 },
      );
    }

    if (action === "activate") {
      await db.collection("cards").updateOne(
        { cardNumber },
        {
          $set: {
            isActive: true,
            activatedAt: new Date(),
            deactivatedAt: null,
          },
        },
      );

      return NextResponse.json(
        {
          success: true,
          message: "Карта успешно активирована",
        },
        { status: 200 },
      );
    }

    if (action === "deactivate") {
      await db
        .collection("cards")
        .updateOne(
          { cardNumber },
          { $set: { isActive: false, deactivatedAt: new Date() } },
        );

      return NextResponse.json(
        {
          success: true,
          message: "Карта успешно деактивирована",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Неправильное действие",
      },
      { status: 400 },
    );
  } catch (e) {
    console.error(`Ошибка при активации/деактивации карты лояльности: ${e}`);
    return NextResponse.json(
      {
        success: false,
        message: `Ошибка при активации/деактивации карты лояльности: ${e}`,
      },
      { status: 500 },
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cardNumber = searchParams.get("cardNumber");
    if (!cardNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Номер телефона не указан",
        },
        { status: 400 },
      );
    }

    const db = await getDB();

    const userWithCard = await db
      .collection("user")
      .findOne({ card: cardNumber });

    if (userWithCard) {
      await db
        .collection("user")
        .updateOne(
          { _id: userWithCard._id },
          { $set: { card: "", hasNoCard: true } },
        );
    }

    const deleteResult = await db.collection("cards").deleteOne({ cardNumber });
    if (!deleteResult.deletedCount) {
      return NextResponse.json(
        {
          success: false,
          message: "Такой карты не существует",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: userWithCard
          ? "Карта успешно удалена и отвязана от пользователя"
          : "Карта успешно удалена",
      },
      { status: 200 },
    );
  } catch (e) {
    console.error(`Ошибка при удалении карты лояльности: ${e}`);
    return NextResponse.json(
      {
        success: false,
        message: `Ошибка при удалении карты лояльности: ${e}`,
      },
      { status: 500 },
    );
  }
};
