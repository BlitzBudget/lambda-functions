const cognitoForgotPassword = require('../../../utils/forgot-password-helper');
const mockSuccess = require('../../fixtures/response/success.json');
const mockRequest = require('../../fixtures/request/forgotPassword.json');

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
    const response = await cognitoForgotPassword.forgotPassword(event);
    expect(response).not.toBeUndefined();
    expect(response.CodeDeliveryDetails).not.toBeUndefined();
    expect(response.CodeDeliveryDetails.DeliveryMedium)
      .toBe(mockSuccess.CodeDeliveryDetails.DeliveryMedium);
  });
});
