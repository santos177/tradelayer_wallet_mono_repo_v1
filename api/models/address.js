const Sequelize = require("sequelize");

module.exports = db => {
  return db.define("address", {
    address: { type: Sequelize.STRING, allowNull: false, unique: true },
  });
};
