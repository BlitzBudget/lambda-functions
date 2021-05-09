const cognitoForgotPassword = require('../../../cognito/forgot-password');
const mockSuccess = require('../../fixtures/response/success');
const mockRequest = require('../../fixtures/request/forgotPassword');

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    forgotPassword: jest.fn(() => ({
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
    const response = await cognitoForgotPassword.handleForgotPassword(event);
    expect(response).not.toBeUndefined();
    expect(response.CodeDeliveryDetails).not.toBeUndefined();
    expect(response.CodeDeliveryDetails.DeliveryMedium)
      .toBe(mockSuccess.CodeDeliveryDetails.DeliveryMedium);
  });
});
