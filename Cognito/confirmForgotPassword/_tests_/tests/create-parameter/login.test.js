const loginParameter = require('../../../create-parameter/login');

describe('loginParameters', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].password = 'notempty';
  event['body-json'].username = 'notempty';

  test('With Data: Success', () => {
    const parameters = loginParameter.createParameter(event);
    expect(parameters).not.toBeNull();
    expect(parameters.AuthFlow).not.toBeNull();
    expect(parameters.ClientId).not.toBeNull();
    expect(parameters.AuthParameters).not.toBeNull();
    expect(parameters.AuthParameters.USERNAME).not.toBeNull();
    expect(parameters.AuthParameters.PASSWORD).not.toBeNull();
  });
});
