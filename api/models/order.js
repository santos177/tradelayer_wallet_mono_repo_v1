const Sequelize = require("sequelize");

module.exports = db => {
  return db.define("Order", {
    offerValue: Sequelize.FLOAT,
    requestValue: Sequelize.FLOAT
  });
};
