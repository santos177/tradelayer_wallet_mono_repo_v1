const Sequelize = require("sequelize");

module.exports = db => {
  return db.define("property", {
    name:{
      type: Sequelize.STRING, unique: true, allowNull: false
    },
    prop_id: {
      type: Sequelize.STRING, unique: true, allowNull: false
    },
    data:Sequelize.STRING,
    url :Sequelize.STRING,  
    category: Sequelize.STRING,
    subcategory: Sequelize.STRING,
    creationTxId: Sequelize.STRING,
    totalTokens: Sequelize.INTEGER,
    creationBlock: Sequelize.INTEGER,
    divisible: Sequelize.BOOLEAN, 
    fixedIssuance: Sequelize.BOOLEAN
  });
};
