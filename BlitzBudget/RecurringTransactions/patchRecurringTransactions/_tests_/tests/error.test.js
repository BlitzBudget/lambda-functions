const patchBudget = require('../../index');
const mockRequest = require('../fixtures/request/patchRecurringTransactionNewCategory.json');
const mockResponse = require('../fixtures/response/updateTransaction.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      update: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

jest.mock('../../fetch/category', () => ({
  getCategoryData: () => Promise.resolve({ Category: undefined }),
}));

describe('Patch Budget item', () => {
  const event = mockRequest;
  test('With Data: Error Update', async () => {
    await patchBudget
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
