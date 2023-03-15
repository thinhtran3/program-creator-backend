const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const couponSchema = sequelizeClient.define("coupon", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sellerId: {type: DataTypes.INTEGER, required: true},
    status: {type: Sequelize.ENUM("EXPIRED", "IN_PROGRESS", "SCHEDULED"), defaultValue: "IN_PROGRESS"},
    discountCode: {type: DataTypes.STRING, required: true},
    programName: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
    minimumPurchasedAmount: {type: DataTypes.BIGINT},
    discountValue: {type: DataTypes.BIGINT},
    couponPrice: {type: DataTypes.BIGINT},
    totalCouponCode: {type: DataTypes.INTEGER, defaultValue: '0'},
    from_date: {type: DataTypes.DATE},
    to_date: {type: DataTypes.DATE},
    usageLimit: {type: Sequelize.ENUM("ONE_TIME", "UNLIMITED"), defaultValue: "ONE_TIME"}
  }, {
    underscored: true,
  });

  couponSchema.associate = function (models) {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return couponSchema
};
