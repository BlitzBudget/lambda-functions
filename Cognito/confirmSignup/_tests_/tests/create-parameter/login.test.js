const loginParameter = require('../../../create-parameter/login');

describe('createLoginParameters', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
    process.env.USER_POOL_ID = '3';
  });
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
