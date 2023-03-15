const app = require('../../src/app');

describe('\'onboardGoal\' service', () => {
  it('registered the service', () => {
    const service = app.service('onboard-goal');
    expect(service).toBeTruthy();
  });
});
