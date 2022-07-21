const cognitoRefreshToken = require('../../../utils/refresh-token-helper');
const mockSuccess = require('../../fixtures/response/success.json');
const mockRequest = require('../../fixtures/request/refreshToken.json');

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    initiateAuth: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.resolve(mockSuccess)),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('handleRefreshToken', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await cognitoRefreshToken.refreshToken(event);
    expect(response).not.toBeUndefined();
    expect(response.AuthenticationResult).not.toBeUndefined();
    expect(response.AuthenticationResult.AccessToken)
      .toBe(mockSuccess.AuthenticationResult.AccessToken);
  });
});
