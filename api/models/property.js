const Sequelize = require("sequelize");

module.exports = db => {
  return db.define("Property", {
    name: Sequelize.STRING,
    prop_id: Sequelize.INTEGER
  });
};
