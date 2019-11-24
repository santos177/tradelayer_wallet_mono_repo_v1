const Sequelize = require("sequelize");
const createWallet = require("./wallet.js");
const createBalance = require("./balance.js");
const createProperty = require("./property.js");
const createOrder = require("./order.js");
const createAddress = require("./address.js");
const createChannel = require("./channel.js");
const createTxn= require("./txn.js");
const config = require("../config.js")

const db = new Sequelize({
  database: config.DBNAME,
  dialect: "postgres",
  username:config.DBUSER,
  password: config.DBPASSWORD,
  define: {
    underscored: true,
    returning: true
  }
});

const Wallet = createWallet(db);
const Balance = createBalance(db);
const Property = createProperty(db);
const Order = createOrder(db);
const Address = createAddress(db);
const Channel = createChannel(db);
const Txn = createTxn(db)
Wallet.hasMany(Address);


Address.belongsTo(Wallet)
Address.hasMany(Order);
Address.hasMany(Balance);


Balance.belongsTo(Address);
Balance.belongsTo(Property);
Balance.belongsTo(Channel);

Order.belongsTo(Address);
Order.belongsTo(Property, { as: "requestedProp" });
Order.belongsTo(Property, { as: "offeredProp" });


Property.hasMany(Balance)
Property.belongsTo(Address, {as: "issuer"})
// TODO: has many order requests
// TODO has many offeredProps

Channel.hasMany(Balance)

module.exports = {
  db,
  Wallet,
  Balance,
  Property,
  Address,
  Channel, 
  Txn
};
