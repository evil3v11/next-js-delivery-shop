const products = require("./productsDatabase.json");

module.exports = {
  async up(db) {
    await db.collection("products").insertMany(products);
  },

  // async down(db) {},
};
