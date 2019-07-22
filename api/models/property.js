const Sequelize = require("sequelize");

module.exports = db => {
  return db.define("property", {
    name:{
      type: Sequelize.STRING, unique: true, alloNull: false
    },
    prop_id: {
      type: Sequelize.STRING, unique: true, alloNull: false
    }
  });
};
