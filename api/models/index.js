const Sequelize = require("sequelize");
const createWallet = require("./wallet.js");
const createBalance = require("./balance.js");
const createProperty = require("./property.js");
const createOrder = require("./order.js");

const db = new Sequelize({
  database: "tradelayer",
  dialect: "postgres",
  define: {
    underscored: true,
    returning: true
  }
});

const Wallet = createWallet(db);
const Balance = createBalance(db);
const Property = createProperty(db);
const Order = createOrder(db);

Balance.belongsTo(Wallet);
Balance.belongsTo(Property);

Wallet.hasMany(Balance);
Wallet.hasMany(Order);

Order.belongsTo(Wallet);
Order.belongsTo(Property, { as: "requestedProp" });
Order.belongsTo(Property, { as: "offeredProp" });

module.exports = {
  db,
  Wallet,
  Balance,
  Property
};
