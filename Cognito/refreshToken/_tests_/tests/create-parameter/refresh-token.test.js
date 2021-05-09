const refreshTokenParameter = require('../../../create-parameter/refresh-token');

describe('createParameter', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].refreshToken = 'notempty';

  test('With Data: Success', () => {
    const parameters = refreshTokenParameter.createParameter(event);
    expect(parameters).not.toBeUndefined();
    expect(parameters.ClientId).not.toBeUndefined();
    expect(parameters.AuthParameters.REFRESH_TOKEN).not.toBeUndefined();
  });
});
