const cognitoSignup = require('../../../cognito/confirm-signup');
const mockSuccess = require('../../fixtures/response/confirmSignup');
const mockRequest = require('../../fixtures/request/confirmSignup');

const cognitoidentityserviceprovider = {
  confirmSignUp: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(Promise.resolve(mockSuccess)),
  })),
};

describe('confirmSignUp', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await cognitoSignup.confirmSignUp(event, cognitoidentityserviceprovider);
    expect(response).not.toBeNull();
    expect(response).not.toBeUndefined();
  });
});
