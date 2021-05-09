const addHelper = require('../../../utils/add-helper');
const mockRequest = require('../../fixtures/request/withDateAndCategory.json');
const mockResponse = require('../../fixtures/response/fetch-budget.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      put: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('addBudgetIfNotAlreadyPresent', () => {
  test('With Data: Success', async () => {
    const budgetId = await addHelper
      .addBudgetIfNotAlreadyPresent(true, new Date('2021-03'), mockRequest, []);

    expect(budgetId).not.toBeUndefined();
  });

  test('Fetch Budget : Not Matching Budget', async () => {
    const budgetId = await addHelper
      .addBudgetIfNotAlreadyPresent(false, new Date('2021-03'), mockRequest, []);

    expect(budgetId).not.toBeUndefined();
  });

  test('Fetch Budget : Matching Budget', async () => {
    mockRequest['body-json'].category = 'Category#2021-01-04T15:39:23.658Z';
    mockRequest['body-json'].dateMeantFor = 'Date#2021-01-03T10:16:52.571Z';

    const budgetId = await addHelper
      .addBudgetIfNotAlreadyPresent(false, new Date('2021-03'), mockRequest, []);

    expect(budgetId).not.toBeUndefined();
    expect(budgetId).toBe('Budget#2021-01-04T15:39:23.683Z');
  });
});
