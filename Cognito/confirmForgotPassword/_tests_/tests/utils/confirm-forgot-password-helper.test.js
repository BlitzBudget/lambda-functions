const confirmForgotPassword = require('../../../utils/confirm-forgot-password-helper');
const mockSuccess = require('../../fixtures/response/confirmForgotPassword');
const mockRequest = require('../../fixtures/request/confirmForgotPassword');

const cognitoidentityserviceprovider = {
  confirmForgotPassword: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(Promise.resolve(mockSuccess)),
  })),
};

const cognitoidentityserviceproviderError = {
  confirmForgotPassword: jest.fn(() => ({
    promise: jest.fn()
      .mockRejectedValueOnce(mockSuccess),
  })),
};

describe('confirmForgotPassword', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await confirmForgotPassword
      .confirmForgotPassword(event, cognitoidentityserviceprovider);
    expect(response).not.toBeUndefined();
    expect(response).not.toBeUndefined();
  });

  test('With Data: Error', async () => {
    await confirmForgotPassword
      .confirmForgotPassword(event, cognitoidentityserviceproviderError).catch((err) => {
        expect(err).not.toBeUndefined();
        expect(err.message).toMatch(/Unable to confirm forgot password from cognito/);
      });
  });
});
