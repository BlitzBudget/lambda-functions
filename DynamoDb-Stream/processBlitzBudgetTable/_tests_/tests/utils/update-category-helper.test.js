const updateCategory = require('../../../utils/update-category-helper');
const mockRequest = require('../../fixtures/request/processBlitzBudgetTable.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Update Category item', () => {
  const events = [];
  test('MODIFY Category: Success', async () => {
    await updateCategory
      .updateCategoryTotal(mockRequest.Records[0], events, documentClient);
    expect(events.length).toBe(1);
  });

  test('INSERT Category: Success', async () => {
    await updateCategory
      .updateCategoryTotal(mockRequest.Records[3], events, documentClient);
    expect(events.length).toBe(2);
  });

  test('REMOVE Category: Success', async () => {
    await updateCategory
      .updateCategoryTotal(mockRequest.Records[2], events, documentClient);
    expect(events.length).toBe(3);
  });

  test('MODIFY With different Name Category: Success', async () => {
    mockRequest.Records[0].dynamodb.OldImage.category = {
      S: 'Debt',
    };
    await updateCategory
      .updateCategoryTotal(mockRequest.Records[0], events, documentClient);
    expect(events.length).toBe(5);
  });
});
