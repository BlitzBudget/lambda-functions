const cognitoLogin = require('../../index');
const mockLoginError = require('../fixtures/response/userNotFoundException');
const mockConfirmSignupSuccess = require('../fixtures/response/confirmForgotPassword');
const mockFetchUserSuccess = require('../fixtures/response/fetchUser');
const mockRequest = require('../fixtures/request/confirmForgotPassword');

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    initiateAuth: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.resolve(mockLoginError)),
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
    cognitoLogin.handler(event).catch((error) => {
      expect(error).not.toBeUndefined();
      expect(error.message).not.toBeUndefined();
      expect(error.message).toMatch(/Unable to get user attributes from cognito/);
    });
  });
});