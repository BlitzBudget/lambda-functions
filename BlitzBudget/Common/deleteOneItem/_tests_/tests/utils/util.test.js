const util = require('../../../utils/util');
const mockRequest = require('../../fixtures/request/deleteOneItem.json');
const mockRequestSNS = require('../../fixtures/request/deleteFromSNS.json');

describe('extractVariablesFromRequest', () => {
  const events = mockRequest;
  test('With Data: Success', async () => {
    const response = await util
      .extractVariablesFromRequest(events);

    expect(response.pk).not.toBeUndefined();
    expect(response.sk).not.toBeUndefined();
    expect(response.fromSns).not.toBeUndefined();
  });

  test('With Data Delete from SNS: Success', async () => {
    const response = await util
      .extractVariablesFromRequest(mockRequestSNS);

    expect(response.pk).not.toBeUndefined();
    expect(response.sk).not.toBeUndefined();
    expect(response.fromSns).not.toBeUndefined();
    expect(response.fromSns).toBe(true);
  });

  test('Without Data Delete from SNS: Success', async () => {
    const response = await util
      .extractVariablesFromRequest({
        'body-json': {
          walletId: 'Wallet#123',
          itemId: 'Category#123',
        },
      });

    expect(response.pk).not.toBeUndefined();
    expect(response.sk).not.toBeUndefined();
    expect(response.fromSns).not.toBeUndefined();
    expect(response.fromSns).toBe(false);
  });
});

describe('isNotEmpty', () => {
  test('With Data: Success', () => {
    expect(util.isNotEmpty('en')).toBe(true);
  });

  test('Without Data: Success', () => {
    expect(util.isNotEmpty('')).toBe(false);
    expect(util.isNotEmpty(null)).toBe(false);
  });
});
