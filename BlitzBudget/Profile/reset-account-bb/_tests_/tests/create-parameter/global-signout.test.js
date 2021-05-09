const globalSignoutParameter = require('../../../create-parameter/global-signout');
const mockRequest = require('../../fixtures/request/deleteAccount.json');

describe('snsParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameters = globalSignoutParameter.createParameter(mockRequest);
    expect(parameters).not.toBeUndefined();
    expect(parameters.AccessToken).not.toBeUndefined();
  });
});
