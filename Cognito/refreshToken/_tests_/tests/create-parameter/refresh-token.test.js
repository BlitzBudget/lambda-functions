const refreshTokenParameter = require('../../../create-parameter/refresh-token');

describe('createParameter', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].refreshToken = 'notempty';

  test('With Data: Success', () => {
    const parameters = refreshTokenParameter.createParameter(event);
    expect(parameters).not.toBeNull();
    expect(parameters.ClientId).not.toBeNull();
    expect(parameters.AuthParameters.REFRESH_TOKEN).not.toBeNull();
  });
});
