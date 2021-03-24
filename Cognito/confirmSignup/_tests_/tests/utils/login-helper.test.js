const cognitoLogin = require('../../../utils/login-helper');
const mockSuccess = require('../../fixtures/response/login');
const mockRequest = require('../../fixtures/request/confirmSignup');

const cognitoidentityserviceprovider = {
  initiateAuth: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(Promise.resolve(mockSuccess)),
  })),
};

describe('initiateAuth', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await cognitoLogin.login(event, cognitoidentityserviceprovider);
    expect(response).not.toBeNull();
    expect(response.AuthenticationResult).not.toBeUndefined();
    expect(response.AuthenticationResult.AccessToken).not.toBeUndefined();
    expect(response.AuthenticationResult.RefreshToken).not.toBeUndefined();
  });
});