const cognitoSignupHelper = require('../../../utils/confirm-signup-helper');
const mockSuccess = require('../../fixtures/response/confirmSignup');
const mockRequest = require('../../fixtures/request/confirmSignup');

const cognitoidentityserviceprovider = {
  confirmSignUp: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(Promise.resolve(mockSuccess)),
  })),
};

describe('confirmSignup', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await cognitoSignupHelper.confirmSignup(event, cognitoidentityserviceprovider);
    expect(response).toBeUndefined();
  });
});
