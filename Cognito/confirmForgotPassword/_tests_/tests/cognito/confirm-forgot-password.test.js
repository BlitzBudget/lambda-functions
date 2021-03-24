const confirmForgotPassword = require('../../../cognito/confirm-forgot-password');
const mockSuccess = require('../../fixtures/response/confirmForgotPassword');
const mockRequest = require('../../fixtures/request/confirmForgotPassword');

const cognitoidentityserviceprovider = {
  confirmForgotPassword: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(Promise.resolve(mockSuccess)),
  })),
};

describe('confirmForgotPassword', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await confirmForgotPassword
      .confirmForgotPassword(event, cognitoidentityserviceprovider);
    expect(response).not.toBeNull();
    expect(response).not.toBeUndefined();
  });
});
