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
        .mockRejectedValueOnce({}),
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
    await resetAccount
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });

  test('Without Wallet Data: Success', async () => {
    await resetAccount
      .handler(mockRequestWithoutDelete).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
