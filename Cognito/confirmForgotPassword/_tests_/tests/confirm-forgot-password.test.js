const cognitoLogin = require('../../index');
const mockLoginSuccess = require('../fixtures/response/login');
const mockConfirmSignupSuccess = require('../fixtures/response/confirmForgotPassword');
const mockFetchUserSuccess = require('../fixtures/response/fetchUser');
const mockRequest = require('../fixtures/request/confirmForgotPassword');

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    initiateAuth: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.resolve(mockLoginSuccess)),
    })),
    getUser: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.resolve(mockFetchUserSuccess)),
    })),
    confirmForgotPassword: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.resolve(mockConfirmSignupSuccess)),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('index: Handler', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await cognitoLogin.handler(event);
    expect(response).not.toBeNull();
    expect(response.AuthenticationResult).not.toBeUndefined();
    expect(response.AuthenticationResult.AccessToken).not.toBeUndefined();
    expect(response.AuthenticationResult.RefreshToken).not.toBeUndefined();
    expect(response.Username).not.toBeUndefined();
    expect(response.UserAttributes[0].Value).not.toBeUndefined();
    expect(response.UserAttributes[1].Value).not.toBeUndefined();
    expect(response.UserAttributes[2].Value).not.toBeUndefined();
    expect(response.UserAttributes[3].Value).not.toBeUndefined();
    expect(response.UserAttributes[4].Value).not.toBeUndefined();
    expect(response.UserAttributes[5].Value).not.toBeUndefined();
    expect(response.UserAttributes[6].Value).not.toBeUndefined();
    expect(response.UserAttributes[7].Value).not.toBeUndefined();
  });
});
