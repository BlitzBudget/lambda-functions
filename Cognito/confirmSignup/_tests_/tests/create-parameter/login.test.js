const loginParameter = require('../../../create-parameter/login');

describe('createLoginParameters', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].username = 'notempty';
  event['body-json'].password = 'notempty';

  test('With Data: Success', () => {
    const parameters = loginParameter.createParameter(event);
    expect(parameters).not.toBeUndefined();
    expect(parameters.AuthFlow).not.toBeUndefined();
    expect(parameters.ClientId).not.toBeUndefined();
    expect(parameters.AuthParameters).not.toBeUndefined();
    expect(parameters.AuthParameters.USERNAME).not.toBeUndefined();
    expect(parameters.AuthParameters.PASSWORD).not.toBeUndefined();
  });
});
