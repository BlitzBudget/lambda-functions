const snsHelper = require('../../../utils/sns-helper');
const snsCreateTransaction = require('../../../sns/create-transaction');
const mockRequest = require('../../fixtures/response/success.json');

const sns = {
  publish: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('SNS publish without Data', () => {
  const events = [];
  test('Without Data: Success', async () => {
    await snsHelper
      .sendSNSToCreateNewTransactions(events);
    expect(events.length).toBe(0);
  });
});

describe('SNS publish with data', () => {
  const eventsWithData = [];
  eventsWithData.push(snsCreateTransaction
    .markTransactionForCreation(mockRequest.Transaction[0], sns, []));
  test('With Data: Success', async () => {
    await snsHelper
      .sendSNSToCreateNewTransactions(eventsWithData);
    expect(eventsWithData.length).toBe(1);
    expect(sns.publish).toHaveBeenCalledTimes(1);
  });
});
