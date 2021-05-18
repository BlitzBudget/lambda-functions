const patchBudget = require('../../index');
const mockRequest = require('../fixtures/request/existingCategory.json');
const mockResponse = require('../fixtures/response/fetchBudget.json');

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

jest.mock('../../fetch/budget', () => ({
  getBudgetsItem: () => Promise.resolve({ Budget: undefined }),
}));

jest.mock('../../fetch/category', () => ({
  getCategoryData: () => Promise.resolve({ Category: undefined }),
}));

describe('Patch Budget item', () => {
  const event = mockRequest;
  test('With Data: Error update', async () => {
    await patchBudget
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
