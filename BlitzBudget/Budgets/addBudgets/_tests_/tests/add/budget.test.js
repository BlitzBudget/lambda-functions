const addBudget = require('../../../add/budget');
const mockRequest = require('../../fixtures/request/withDateAndCategory.json');

const documentClient = {
  put: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Add Budget item', () => {
  test('With Data: Success', async () => {
    const response = await addBudget
      .addNewBudget(mockRequest, documentClient);
    expect(response).not.toBeUndefined();
    expect(response.success).not.toBeUndefined();
    expect(response.budgetId).not.toBeUndefined();
  });
});
