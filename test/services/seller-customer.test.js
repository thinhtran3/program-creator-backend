const app = require('../../src/app');

describe('\'seller-customer\' service', () => {
  it('registered the service', () => {
    const service = app.service('seller-customer');
    expect(service).toBeTruthy();
  });
});
