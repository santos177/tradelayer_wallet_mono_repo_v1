const Sequelize = require("sequelize");
const createAddress = require("./address.js");
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

const Address = createAddress(db);
const Balance = createBalance(db);
const Property = createProperty(db);
const Order = createOrder(db);

Balance.belongsTo(Address);
Balance.belongsTo(Property);

Address.hasMany(Balance);
Address.hasMany(Property);

Order.belongsTo(Address);
Order.belongsTo(Property, { as: "requestedProp" });
Order.belongsTo(Property, { as: "offeredProp" });

module.exports = {
  db,
  Address,
  Balance,
  Property
};
