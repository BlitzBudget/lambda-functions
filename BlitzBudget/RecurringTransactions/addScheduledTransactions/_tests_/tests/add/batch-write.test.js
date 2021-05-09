const batchWriteDynamo = require('../../../add/batch-write');
const mockResponse = require('../../fixtures/request/addScheduledTransactions.json');

const documentClient = {
  batchWrite: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('batchWriteItems helper', () => {
  test('With Data: Success', async () => {
    const response = await batchWriteDynamo
      .batchWriteItems(mockResponse, documentClient);

    expect(response).not.toBeUndefined();
    expect(documentClient.batchWrite).toHaveBeenCalledTimes(1);
  });
});
