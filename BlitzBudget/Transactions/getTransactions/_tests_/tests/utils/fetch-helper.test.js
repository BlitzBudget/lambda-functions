const fetchHelper = require('../../../utils/fetch-helper');
const mockRequest = require('../../fixtures/request/getTransactions.json');
const mockResponse = require('../../fixtures/response/fetchRecurringTransaction.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
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

describe('fetchAllRelevantItems', () => {
  const event = mockRequest;
  const events = [];
  test('With Data: Success', async () => {
    const response = await fetchHelper.fetchAllRelevantItems(events, event['body-json'].walletId, '2021-02', '2021-03');
    expect(response).not.toBeUndefined();
    expect(response.allResponses).not.toBeUndefined();
    expect(response.snsEvents).not.toBeUndefined();
    expect(response.snsEvents.length).toBe(1);
  });
});

describe('fetchWalletItem : Wallet', () => {
  const event = mockRequest;
  test('With WalletId Data: Success', async () => {
    const response = await fetchHelper.fetchWalletItem(event['body-json'].walletId, 'userId');
    expect(response).not.toBeUndefined();
    expect(response).toBe('Wallet#2020-05-13T16:31:44.181Z');
  });
});
