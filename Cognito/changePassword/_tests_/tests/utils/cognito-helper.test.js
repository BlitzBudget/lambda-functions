const cognitoHelper = require('../../../utils/cognito-helper');
const mockSuccess = require('../../fixtures/response/success');
const mockRequest = require('../../fixtures/request/changePassword');

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    changePassword: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.resolve(mockSuccess)),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('changePassword', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await cognitoHelper
      .changePassword(event);
    expect(response).not.toBeNull();
    expect(response).not.toBeUndefined();
  });
});
