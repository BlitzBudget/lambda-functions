const updateHelper = require('../../../utils/update-helper');
const mockRequest = require('../../fixtures/request/patchWallet.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      update: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce({}),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('Update Wallet item', () => {
  test('Without Matching Wallet: Success', async () => {
    const response = await updateHelper
      .handleUpdateItems(mockRequest);
    expect(response).toBeUndefined();
  });
});
