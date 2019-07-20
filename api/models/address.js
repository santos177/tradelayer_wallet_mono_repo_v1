const Sequelize = require("sequelize");

module.exports = db => {
  return db.define("Address", {
    rating: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
};
