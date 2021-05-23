const patchBudget = require('../../index');
const mockRequest = require('../fixtures/request/withoutDate.json');
const mockUpdateResponse = require('../fixtures/response/addCategory.json');
const mockDateResponse = require('../fixtures/response/fetchDate.json');
const mockCategoryResponse = require('../fixtures/response/fetchCategory.json');
const mockFetchResponse = require('../fixtures/response/fetchTransaction.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      put: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockUpdateResponse),
      })),
      update: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockUpdateResponse),
      })),
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockFetchResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

jest.mock('../../fetch/category', () => ({
  getCategoryData: () => Promise.resolve(mockCategoryResponse),
}));

jest.mock('../../fetch/date', () => ({
  getDateData: () => Promise.resolve(mockDateResponse),
}));

describe('Add Transaction item', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await patchBudget
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response['body-json']).not.toBeUndefined();
    expect(response['body-json'].amount).not.toBeUndefined();
    expect(response['body-json'].walletId).not.toBeUndefined();
    expect(response['body-json'].transactionId).not.toBeUndefined();
    expect(response['body-json'].category).toBe('Category#2020-04-03T11:16:16.852Z');
    expect(response['body-json'].category).not.toBeUndefined();
    expect(response['body-json'].dateMeantFor).not.toBeUndefined();
    expect(response['body-json'].dateMeantFor).toMatch(/Date#/);
    expect(response['body-json'].recurrence).not.toBeUndefined();
  });
});
