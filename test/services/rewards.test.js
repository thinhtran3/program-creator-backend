const app = require('../../src/app');

describe('\'rewards\' service', () => {
  it('registered the service', () => {
    const service = app.service('rewards');
    expect(service).toBeTruthy();
  });
});
