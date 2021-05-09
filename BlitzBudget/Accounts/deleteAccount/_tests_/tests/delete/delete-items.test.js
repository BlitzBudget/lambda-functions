const deleteItems = require('../../../delete/delete-items');
const deleteRequestParameter = require('../../../create-parameter/delete-request');
const deleteItemParameter = require('../../../create-parameter/delete-item');

const dynamoDB = {
  batchWrite: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('delete item', () => {
  const parameter = deleteRequestParameter.createParameter('primaryKey', 'secondaryKey');
  const parameters = deleteItemParameter.createParameter(parameter);

  test('With Data: Success', async () => {
    const response = await deleteItems.deleteItems(parameters, dynamoDB);
    expect(response).not.toBeUndefined();
  });
});
