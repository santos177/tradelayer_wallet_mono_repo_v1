const Sequelize = require("sequelize");

module.exports = db => {
  return db.define("order", {
    offerValue: Sequelize.FLOAT,
    requestValue: Sequelize.FLOAT
  });
};
