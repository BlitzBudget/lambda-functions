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

  test('With Data: Success', async () => {
    const response = await util
      .extractVariablesFromRequest(mockRequestSNS);

    expect(response.pk).not.toBeUndefined();
    expect(response.sk).not.toBeUndefined();
    expect(response.fromSns).not.toBeUndefined();
  });
});
