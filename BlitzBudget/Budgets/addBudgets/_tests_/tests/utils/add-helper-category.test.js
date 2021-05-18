const addHelper = require('../../../utils/add-helper');
const mockRequest = require('../../fixtures/request/withDateAndCategory.json');
const mockRequestWithoutCategoryId = require('../../fixtures/request/addBudget.json');
const mockResponse = require('../../fixtures/response/fetch-category.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      update: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('createCategoryIfNecessary', () => {
  test('With Data: Success', async () => {
    const categoryResponse = await addHelper.createCategoryIfNecessary(mockRequest, new Date('2021-03'), []);

    expect(categoryResponse.hasNewCategoryBeenCreated).not.toBeUndefined();
    expect(categoryResponse.hasNewCategoryBeenCreated).toBe(false);
  });

  test('Fetch Category : Not Matching Category', async () => {
    const categoryResponse = await addHelper
      .createCategoryIfNecessary(mockRequestWithoutCategoryId, new Date('2021-03'), []);

    expect(categoryResponse.hasNewCategoryBeenCreated).not.toBeUndefined();
    expect(categoryResponse.hasNewCategoryBeenCreated).toBe(true);
  });

  test('Fetch Category : Matching Category', async () => {
    mockRequestWithoutCategoryId['body-json'].category = 'Salary';

    const categoryResponse = await addHelper
      .createCategoryIfNecessary(mockRequestWithoutCategoryId, new Date('2021-03'), []);

    expect(categoryResponse.hasNewCategoryBeenCreated).not.toBeUndefined();
    expect(categoryResponse.hasNewCategoryBeenCreated).toBe(false);
  });
});
