const userAttribute = require('../../../create-parameter/user-attribute');
const constants = require('../../../constants/constant');
const mockUserAttributes = require('../../fixtures/request/getUserAttributes');

describe('changePasswordParameters', () => {
  const event = mockUserAttributes;
  test('With Data: Success', () => {
    const parameters = userAttribute.createParameter(event);
    expect(parameters).not.toBeUndefined();
    expect(parameters.UserPoolId).not.toBeUndefined();
    expect(parameters.Username).not.toBeUndefined();
    expect(parameters.Username).toBe(event.params.querystring.userName);
    expect(parameters.UserPoolId).toBe(constants.USER_POOL_ID);
  });
});
