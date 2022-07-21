const cognitoLogin = require('../../../cognito/login');
const mockSuccess = require('../../fixtures/response/login.json');
const mockRequest = require('../../fixtures/request/confirmSignup.json');

const cognitoidentityserviceprovider = {
  initiateAuth: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(Promise.resolve(mockSuccess)),
  })),
};

describe('initiateAuth', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await cognitoLogin.initiateAuth(event, cognitoidentityserviceprovider);
    expect(response).not.toBeUndefined();
    expect(response.AuthenticationResult).not.toBeUndefined();
    expect(response.AuthenticationResult.AccessToken).not.toBeUndefined();
    expect(response.AuthenticationResult.RefreshToken).not.toBeUndefined();
  });
});
