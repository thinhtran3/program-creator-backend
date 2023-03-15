const app = require('../../src/app');

describe('\'onboard\' service', () => {
  it('registered the service', () => {
    const service = app.service('onboard');
    expect(service).toBeTruthy();
  });
});
