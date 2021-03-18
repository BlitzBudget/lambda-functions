const loginParameter = require('../../../create-parameter/login');

describe('createLoginParameters', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].username = 'notempty';
  event['body-json'].password = 'notempty';

  test('With Data: Success', () => {
    const parameters = loginParameter.createLoginParameters(event);
    expect(parameters).not.toBeNull();
    expect(parameters.AuthFlow).not.toBeNull();
    expect(parameters.ClientId).not.toBeNull();
    expect(parameters.AuthParameters).not.toBeNull();
    expect(parameters.AuthParameters.USERNAME).not.toBeNull();
    expect(parameters.AuthParameters.PASSWORD).not.toBeNull();
  });
});
