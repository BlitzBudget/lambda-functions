const getBudget = require('../../index');
const mockRequest = require('../fixtures/request/byUserId.json');
const mockResponse = require('../fixtures/response/fetch-budget.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('Get Budget item', () => {
  const event = mockRequest;
  test('With Data: Error', async () => {
    await getBudget
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
