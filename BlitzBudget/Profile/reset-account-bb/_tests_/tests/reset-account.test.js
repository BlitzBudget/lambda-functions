const resetAccount = require('../../index');
const mockRequest = require('../fixtures/request/deleteAccount.json');
const mockRequestWithoutDelete = require('../fixtures/request/resetAccountCall.json');

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    adminDeleteUser: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.resolve({})),
    })),
    globalSignOut: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.resolve({})),
    })),
  })),
  SNS: jest.fn(() => ({
    publish: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce({}),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('Get Reset Account item', () => {
  const event = mockRequest;
  test('Without Wallet Data: Success', async () => {
    const response = await resetAccount
      .handler(event);
    expect(response).not.toBeUndefined();
  });

  test('Without Wallet Data: Success', async () => {
    const response = await resetAccount
      .handler(mockRequestWithoutDelete);
    expect(response).not.toBeUndefined();
  });
});
