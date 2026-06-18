const users = require("./usersDatabase.json");

module.exports = {
  async up(db) {
    await db.collection("users").insertMany(users);
  },

  // async down(db) {},
};
