import { MongoClient } from "mongodb";
import "dotenv/config";

import { faker } from "@faker-js/faker";

const addArticleField = async () => {
  try {
    const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
    await client.connect();
    console.log("Соединение с MongoDB...");

    const db = client.db(process.env.DELIVERY_SHOP_DB_NAME);
    const productsCollection = db.collection("products");
    const existingProducts = await productsCollection.find({}).toArray();

    const bulkOps = existingProducts.map((product) => {
      const articleNumber = faker.number.int({ min: 0, max: 999999 });
      const article = String(articleNumber).padStart(6, "0");
      return {
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              article: article,
            },
          },
        },
      };
    });

    if (bulkOps.length > 0) {
      const updateResult = await db.collection("products").bulkWrite(bulkOps);
      console.log(`Обновлено ${updateResult.modifiedCount} продуктов`);
      console.log("Добавлено поле article с 6-значными номерами");
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

addArticleField();
