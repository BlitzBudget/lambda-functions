const updateHelper = require('../../../utils/update-helper');
const addHelper = require('../../../utils/add-helper');
const mockRequest = require('../../fixtures/request/patchTransactions.json');
const mockResponse = require('../../fixtures/response/fetchTransaction.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Update Transaction item', () => {
  test('With Matching Data: Success', async () => {
    const response = await updateHelper
      .updateAllItems([], mockRequest, documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Transaction).not.toBeUndefined();
    expect(documentClient.update).toHaveBeenCalledTimes(1);
  });

  test('With Category: Success', async () => {
    const events = [];
    await addHelper
      .addCategoryItem(mockRequest, 'sk', 'categoryName', events, documentClient);
    const response = await updateHelper
      .updateAllItems(events, mockRequest, documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Transaction).not.toBeUndefined();
    expect(documentClient.update).toHaveBeenCalledTimes(3);
  });
});
