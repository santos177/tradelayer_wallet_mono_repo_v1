const Sequelize = require("sequelize");

module.exports = db => {
  return db.define("wallet", {
    address: { type: Sequelize.STRING, allowNull: true },
    walletid: Sequelize.STRING,
    passhash: Sequelize.STRING,
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    walletblob: Sequelize.BLOB
  }, {instanceMethods: {
    betBalance: function(propId) {
        console.log(this.addresses)
    }
  }});
};
