const app = require('../../src/app');

describe('\'seller-onboard\' service', () => {
  it('registered the service', () => {
    const service = app.service('seller-onboard');
    expect(service).toBeTruthy();
  });
});
