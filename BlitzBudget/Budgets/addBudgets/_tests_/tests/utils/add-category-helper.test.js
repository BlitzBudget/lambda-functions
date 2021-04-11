const addCategory = require('../../../utils/add-category-helper');
const mockRequest = require('../../fixtures/request/withDateAndCategory.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({ Attributes: {} }),
  })),
};

describe('Add Category item', () => {
  const events = [];
  test('With Data: Success', async () => {
    await addCategory
      .createANewCategoryItem(mockRequest, events, documentClient);
    expect(events.length).not.toBe(0);
    expect(events.length).toBe(1);
    expect(documentClient.update).toHaveBeenCalledTimes(1);
  });
});
