const app = require('../../src/app');

describe('\'tiers\' service', () => {
  it('registered the service', () => {
    const service = app.service('tiers');
    expect(service).toBeTruthy();
  });
});
