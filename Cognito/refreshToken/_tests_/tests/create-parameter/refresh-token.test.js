const refreshTokenParameter = require('../../../create-parameter/refresh-token');

describe('createParameter', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
    process.env.CLIENT_ID = '4';
    process.env.USER_POOL_ID = '3';
  });
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
