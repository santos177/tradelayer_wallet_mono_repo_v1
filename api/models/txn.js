const Sequelize = require("sequelize");

module.exports = db => {
  const Txn = db.define("txn", {
    txid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    allSpent: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
  });
  Txn.markAsSpent = function (txid, next)  {
    this.findByPk(txid).then(txnData => {
      if (!txnData) {
        this.create({
          txid,
          allSpent: true
        }).then(next);
      } else if (!txnData.defaultValues.allSpent) {
        txnData.update({ allSpend: true }).then(next);
      } else {
        next();
      }
    });
  };
  return Txn;
};
