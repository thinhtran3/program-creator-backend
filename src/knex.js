const knex = require('knex');

module.exports = function (app) {
  const connection = app.get('mysql');
  const db = knex({ client: 'mysql', connection });

  app.set('knexClient', db);
};
