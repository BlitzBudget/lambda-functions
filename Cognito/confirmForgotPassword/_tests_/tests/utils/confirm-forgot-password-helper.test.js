const confirmForgotPassword = require('../../../utils/confirm-forgot-password-helper');
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
    expect(response).not.toBeUndefined();
    expect(response).not.toBeUndefined();
  });
});
