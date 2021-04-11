const addBudget = require('../../../utils/add-budget-helper');
const mockRequest = require('../../fixtures/request/withDateAndCategory.json');

const documentClient = {
  put: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Add Budget Helper', () => {
  test('With Data: Success', async () => {
    const budgetId = await addBudget
      .addBudget(mockRequest, new Date('2021-05'), documentClient);
    expect(budgetId).not.toBeUndefined();
    expect(documentClient.put).toHaveBeenCalledTimes(1);
  });
});
