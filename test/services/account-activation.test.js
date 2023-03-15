const app = require('../../src/app');

describe('\'account-activation\' service', () => {
  it('registered the service', () => {
    const service = app.service('account-activation');
    expect(service).toBeTruthy();
  });
});
