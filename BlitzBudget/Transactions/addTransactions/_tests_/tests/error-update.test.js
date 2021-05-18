const patchBudget = require('../../index');
const mockRequest = require('../fixtures/request/addTransactions.json');
const mockUpdateResponse = require('../fixtures/response/addCategory.json');
const mockCategoryResponse = require('../fixtures/response/fetchCategory.json');
const mockFetchResponse = require('../fixtures/response/fetchTransaction.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      put: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockUpdateResponse),
      })),
      update: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockUpdateResponse),
      })),
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockFetchResponse),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

jest.mock('../../fetch/category', () => ({
  getCategoryData: () => Promise.resolve(mockCategoryResponse),
}));

describe('Add Transaction item', () => {
  const event = mockRequest;
  test('With Data: Error Update', async () => {
    await patchBudget
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
