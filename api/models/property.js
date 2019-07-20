const Sequelize = require("sequelize");

module.exports = db => {
  return db.define("property", {
    name: Sequelize.STRING,
    prop_id: Sequelize.INTEGER
  });
};
