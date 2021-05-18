const getGoal = require('../../index');
const mockWithWalletIdAndUserId = require('../fixtures/request/withWalletIdAndUserId.json');
const mockResponse = require('../fixtures/response/fetch-goal.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
      get: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('Get Goal item', () => {
  test('With Data: Success', async () => {
    const response = await getGoal
      .handler(mockWithWalletIdAndUserId);
    expect(response).not.toBeUndefined();
    expect(response.BankAccount).not.toBeUndefined();
    expect(response.Wallet).not.toBeUndefined();
    expect(response.Goal).not.toBeUndefined();
    expect(response.Date).not.toBeUndefined();
  });
});
