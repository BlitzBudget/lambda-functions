const loginHelper = require('../../../utils/login-helper');
const mockLogin = require('../../fixtures/response/login');
const mockRequest = require('../../fixtures/request/signin');

const cognitoidentityserviceprovider = {
  initiateAuth: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(mockLogin),
  })),
};

describe('cognitoLogin', () => {
  const event = mockRequest;

  test('With Data: Success', async () => {
    const response = await loginHelper.cognitoLogin(event, cognitoidentityserviceprovider);
    expect(response).not.toBeUndefined();
    expect(response.AuthenticationResult).not.toBeUndefined();
    expect(response.AuthenticationResult.RefreshToken).not.toBeUndefined();
  });
});
