const app = require('../../src/app');

describe('\'seller-programs\' service', () => {
  it('registered the service', () => {
    const service = app.service('seller-programs');
    expect(service).toBeTruthy();
  });
});
