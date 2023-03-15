const app = require('../../src/app');

describe('\'voucher\' service', () => {
  it('registered the service', () => {
    const service = app.service('voucher');
    expect(service).toBeTruthy();
  });
});
