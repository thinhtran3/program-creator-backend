const app = require('../../src/app');

describe('\'userSeller\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-seller');
    expect(service).toBeTruthy();
  });
});
