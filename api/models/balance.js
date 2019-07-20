const Sequelize = require("sequelize");

module.exports = db => {
 return db.define("Balance", {
    value: Sequelize.FLOAT
  });
};
