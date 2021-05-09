const fetchOverview = require('../../index');
const mockRequest = require('../fixtures/request/overviewWithoutWallet.json');
const mockRequestWithWallet = require('../fixtures/request/overview.json');
const mockResponse = require('../fixtures/response/fetch-transaction.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
      get: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('Get Overview item', () => {
  const event = mockRequest;
  test('Without Wallet Data: Success', async () => {
    const response = await fetchOverview
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response.BankAccount).not.toBeUndefined();
    expect(response.Transaction).not.toBeUndefined();
    expect(response.Date).not.toBeUndefined();
    expect(response.Category).not.toBeUndefined();
    expect(response.Wallet).toBeUndefined();
  });

  test('Without Wallet Data: Success', async () => {
    const response = await fetchOverview
      .handler(mockRequestWithWallet);
    expect(response).not.toBeUndefined();
    expect(response.BankAccount).not.toBeUndefined();
    expect(response.Transaction).not.toBeUndefined();
    expect(response.Date).not.toBeUndefined();
    expect(response.Category).not.toBeUndefined();
    expect(response.Wallet).not.toBeUndefined();
  });
});
