const errors = require('@feathersjs/errors');

const disallow = () => {
  throw new errors.Forbidden('Method not allowed');
};

module.exports = disallow;