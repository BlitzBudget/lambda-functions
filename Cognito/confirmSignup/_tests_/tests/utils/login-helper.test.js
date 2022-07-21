const cognitoLogin = require('../../../utils/login-helper');
const mockSuccess = require('../../fixtures/response/login.json');
const mockRequest = require('../../fixtures/request/confirmSignup.json');

const cognitoidentityserviceprovider = {
  initiateAuth: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(Promise.resolve(mockSuccess)),
  })),
};

const cognitoidentityserviceproviderError = {
  initiateAuth: jest.fn(() => ({
    promise: jest.fn()
      .mockRejectedValueOnce(mockSuccess),
  })),
};

describe('initiateAuth', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await cognitoLogin.login(event, cognitoidentityserviceprovider);
    expect(response).not.toBeUndefined();
    expect(response.AuthenticationResult).not.toBeUndefined();
    expect(response.AuthenticationResult.AccessToken).not.toBeUndefined();
    expect(response.AuthenticationResult.RefreshToken).not.toBeUndefined();
  });

  test('With Data: Error', async () => {
    await cognitoLogin.login(event, cognitoidentityserviceproviderError)
      .catch((err) => {
        expect(err).not.toBeUndefined();
        expect(err.message).toMatch(/Unable to login from cognito/);
      });
  });
});
