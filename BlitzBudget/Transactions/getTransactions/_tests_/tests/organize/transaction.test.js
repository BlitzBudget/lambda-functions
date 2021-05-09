const organizeTransaction = require('../../../organize/transaction');
const mockResponse = require('../../fixtures/response/successWithoutOrganization.json');

describe('organizeTransaction: createParameter', () => {
  test('With Data: Success', () => {
    organizeTransaction.organize(mockResponse, [], true);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Transaction).not.toBeUndefined();
    expect(mockResponse.Transaction[0].transactionId).not.toBeUndefined();
    expect(mockResponse.Transaction[0].walletId).not.toBeUndefined();
  });
});
