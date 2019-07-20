const Sequelize = require("sequelize");

module.exports = db => {
  return db.define("wallet", {
    address: { type: Sequelize.STRING, allowNull: true },
    walletid: Sequelize.STRING,
    passhash: Sequelize.STRING,
    email: Sequelize.STRING,
    walletblob: Sequelize.BLOB,
    });
};
