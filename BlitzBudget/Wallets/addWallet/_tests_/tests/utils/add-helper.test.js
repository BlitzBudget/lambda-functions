const addHelper = require('../../../utils/add-helper');
const mockRequest = require('../../fixtures/request/addWallet.json');
const mockResponse = require('../../fixtures/response/addWallet.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      put: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('With Add Wallet Data', () => {
  test('Success', async () => {
    const response = await addHelper
      .handleAddNewWallet(mockRequest, 'userId', 'currency', 'walletName');
    expect(response).toBeUndefined();
  });
});
