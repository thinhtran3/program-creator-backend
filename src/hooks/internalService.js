const { Forbidden } = require('@feathersjs/errors');

const internalService = (context) => {
  const { params } = context;
  const { provider } = params;

  // Check if the request comes from an internal provider
  if (!provider || provider === 'internal') {
    return context;
  } else {
    throw new Forbidden('Not allowed.');
  }
};

module.exports = internalService;