const deleteRequestHelper = require('../../../utils/delete-request-helper');
const response = require('../../fixtures/response/fetchRecurringTransaction.json');
const transactionResponse = require('../../fixtures/response/fetchTransaction.json');

describe('deleteRequestHelper: buildDeleteRequest', () => {
  const event = [response, transactionResponse];
  const { walletId } = response.Items[0];
  const accountId = response.Items[0].account;
  test('With Data: Success', () => {
    const request = deleteRequestHelper.buildDeleteRequest(
      event,
      walletId,
      accountId,
    );
    expect(request).not.toBeUndefined();
    expect(request.length).not.toBeUndefined();
    expect(request.length).toBe(1);
    expect(request[0].length).not.toBeUndefined();
    expect(request[0].length).toBe(4);
    expect(request[0][0].DeleteRequest.Key).not.toBeUndefined();
    expect(request[0][0].DeleteRequest.Key.pk).toBe(walletId);
    expect(request[0][1].DeleteRequest.Key.pk).toBe(walletId);
    expect(request[0][2].DeleteRequest.Key.pk).toBe(walletId);
    expect(request[0][3].DeleteRequest.Key.pk).toBe(walletId);
    expect(request[0][3].DeleteRequest.Key.sk).toBe(transactionResponse.Items[1].sk);
    expect(request[0][2].DeleteRequest.Key.sk).toBe(transactionResponse.Items[0].sk);
    expect(request[0][1].DeleteRequest.Key.sk).toBe(response.Items[0].sk);
    expect(request[0][0].DeleteRequest.Key.sk).toBe(accountId);
  });
});
