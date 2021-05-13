const addHelper = require('../../../utils/add-helper');
const mockRequest = require('../../fixtures/request/patchTransactions.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({ Attributes: {} }),
  })),
};

describe('Add Category item', () => {
  test('With Data: Success', async () => {
    const events = [];
    await addHelper
      .addCategoryItem(mockRequest, 'sk', 'categoryName', events, documentClient);
    expect(events.length).toBe(1);
    expect(documentClient.update).toHaveBeenCalledTimes(1);
  });
});
