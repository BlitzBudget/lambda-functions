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
        promise: jest.fn().mockRejectedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('Get Goal item', () => {
  test('With Data: Error Get', async () => {
    await getGoal
      .handler(mockWithWalletIdAndUserId).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
