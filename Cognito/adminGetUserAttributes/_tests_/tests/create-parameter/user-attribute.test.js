const userAttribute = require('../../../create-parameter/user-attribute');
const mockUserAttributes = require('../../fixtures/request/getUserAttributes.json');

describe('changePasswordParameters', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
    process.env.USER_POOL_ID = '3';
  });
  const event = mockUserAttributes;
  test('With Data: Success', () => {
    const parameters = userAttribute.createParameter(event);
    expect(parameters).not.toBeUndefined();
    expect(parameters.UserPoolId).not.toBeUndefined();
    expect(parameters.Username).not.toBeUndefined();
    expect(parameters.Username).toBe(event.params.querystring.userName);
    expect(parameters.UserPoolId).toBe(process.env.USER_POOL_ID);
  });
});
