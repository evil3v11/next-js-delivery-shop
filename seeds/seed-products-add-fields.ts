import { MongoClient } from "mongodb";
import "dotenv/config";

import { faker } from "@faker-js/faker";

const updateProducts = async () => {
  try {
    const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
    await client.connect();
    console.log("Соединение с MongoDB...");

    const db = client.db(process.env.DELIVERY_SHOP_DB_NAME);
    const productsCollection = db.collection("products");
    const existingProducts = await productsCollection.find({}).toArray();

    const bulkOps = existingProducts.map((product) => {
      let manufacturer;
      if (product.isOurProduction) manufacturer = "Россия";
      else {
        const manufacturers = [
          "Беларусь",
          "Казахстан",
          "Турция",
          "Китай",
          "Польша",
          "Сербия",
          "Армения",
          "Азербайджан",
        ];
        manufacturer = faker.helpers.arrayElement(manufacturers);
      }

      const brands = [
        "Простоквашино",
        "Беседа",
        "Домик в деревне",
        "ВкусВилл",
        "Агрокомплекс",
        "Green Ray",
        "Фермерский продукт",
        "Натуральный выбор",
        "Добрый",
        "Чистый продукт",
        "Бабушкина крынка",
        "Савушкин продукт",
        "Моя семья",
        "Лента",
        "Магнит",
        "Ашан",
        "Перекресток",
      ];

      const brand = faker.helpers.arrayElement(brands);

      return {
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              manufacturer: manufacturer,
              brand: brand,
            },
            $unset: { isOurProduction: "" },
          },
        },
      };
    });

    if (bulkOps.length > 0) {
      const updateResult = await db.collection("products").bulkWrite(bulkOps);
      console.log(`Обновлено ${updateResult.modifiedCount} продуктов`);
      console.log("Добавлены поля brands и manufacturer");
      console.log("Удалено поле isOurProduction");
    } else {
      console.log("Нет продуктов для обновления");
    }

    await client.close();
    console.log("Закрытие соединения с MongoDB");
  } catch (e) {
    console.log("Ошибка при добавлении поля article в MongoDB: ", e);
    process.exit(1);
  }
};

updateProducts();
