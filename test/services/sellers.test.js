const app = require('../../src/app');

describe('\'sellers\' service', () => {
  it('registered the service', () => {
    const service = app.service('sellers');
    expect(service).toBeTruthy();
  });
});
