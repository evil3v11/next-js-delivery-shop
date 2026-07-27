import { MongoClient } from "mongodb";
import "dotenv/config";

const updateProductsDistribution = async () => {
  try {
    const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
    await client.connect();
    console.log("Соединение с MongoDB...");

    const db = client.db(process.env.DELIVERY_SHOP_DB_NAME);
    const productsCollection = db.collection("products");
    const existingProducts = await productsCollection.find({}).toArray();

    const bulkOps = existingProducts.map((product) => {
      const distribution = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
      };

      return {
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              "rating.rate": 5.0,
              "rating.count": 0,
              "rating.distribution": distribution,
            },
          },
        },
      };
    });

    if (bulkOps.length > 0) {
      const updateResult = await db.collection("products").bulkWrite(bulkOps);
      console.log(`Обновлено ${updateResult.modifiedCount} продуктов`);
      console.log("Обновлено поле rating, добавлено свойство distribution");
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

updateProductsDistribution();
