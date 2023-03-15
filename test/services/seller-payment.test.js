const app = require('../../src/app');

describe('\'seller-payment\' service', () => {
  it('registered the service', () => {
    const service = app.service('seller-payment');
    expect(service).toBeTruthy();
  });
});
