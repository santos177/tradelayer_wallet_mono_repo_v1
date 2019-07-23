const Sequelize = require("sequelize");

module.exports = db => {
 return db.define("balance", {
    amount: Sequelize.FLOAT
  });
};
