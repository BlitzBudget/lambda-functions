const cognitoSignupHelper = require('../../../utils/confirm-signup-helper');
const mockSuccess = require('../../fixtures/response/confirmSignup');
const mockRequest = require('../../fixtures/request/confirmSignup');

const cognitoidentityserviceprovider = {
  confirmSignUp: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(Promise.resolve(mockSuccess)),
  })),
};

const cognitoidentityserviceproviderError = {
  confirmSignUp: jest.fn(() => ({
    promise: jest.fn()
      .mockRejectedValueOnce(mockSuccess),
  })),
};

describe('confirmSignup', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await cognitoSignupHelper.confirmSignup(event, cognitoidentityserviceprovider);
    expect(response).toBeUndefined();
  });

  test('With Data: Error', async () => {
    await cognitoSignupHelper
      .confirmSignup(event, cognitoidentityserviceproviderError).catch((err) => {
        expect(err).not.toBeUndefined();
        expect(err.message).toMatch(/Unable to confirm signup from cognito/);
      });
  });
});
