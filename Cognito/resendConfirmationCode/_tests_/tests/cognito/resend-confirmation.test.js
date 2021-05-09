const resendConfirmation = require('../../../cognito/resend-confirmation');
const mockSuccess = require('../../fixtures/response/success');
const mockRequest = require('../../fixtures/request/resendConfirmationCode');

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    resendConfirmationCode: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.resolve(mockSuccess)),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('resendConfirmationCode', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await resendConfirmation.resendConfirmationCode(event);
    expect(response).not.toBeUndefined();
    expect(response.CodeDeliveryDetails).not.toBeUndefined();
    expect(response.CodeDeliveryDetails.DeliveryMedium)
      .toBe(mockSuccess.CodeDeliveryDetails.DeliveryMedium);
  });
});
