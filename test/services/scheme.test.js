const app = require('../../src/app');

describe('\'scheme\' service', () => {
  it('registered the service', () => {
    const service = app.service('scheme');
    expect(service).toBeTruthy();
  });
});
