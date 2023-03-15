/**
 * Set sequelize is raw, you can get sequelize instance in result
 * @param {*} ctx 
 * @returns 
 */
const sequelizeRaw = ctx => {
  ctx.params.sequelize = ctx.params.sequelize || {} ;
  ctx.params.sequelize.raw = false;
  return ctx;
};

module.exports = sequelizeRaw;
