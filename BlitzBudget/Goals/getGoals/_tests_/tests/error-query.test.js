const getGoal = require('../../index');
const mockWithWalletIdAndUserId = require('../fixtures/request/withWalletIdAndUserId.json');
const mockResponse = require('../fixtures/response/fetch-goal.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockResponse),
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

describe('Get Goal item', () => {
  test('With Data: Error Query', async () => {
    await getGoal
      .handler(mockWithWalletIdAndUserId).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
