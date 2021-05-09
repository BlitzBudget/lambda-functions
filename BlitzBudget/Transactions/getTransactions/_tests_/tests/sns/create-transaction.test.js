const snsCreateTransaction = require('../../../sns/create-transaction');
const mockRequest = require('../../fixtures/response/fetchTransaction.json');

const sns = {
  publish: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('SNS publish with data', () => {
  const eventsWithData = [];
  test('Success', async () => {
    const response = await snsCreateTransaction
      .markTransactionForCreation(mockRequest.Items[0], sns, eventsWithData);
    expect(response).not.toBeUndefined();
    expect(sns.publish).toHaveBeenCalledTimes(1);
  });
});
