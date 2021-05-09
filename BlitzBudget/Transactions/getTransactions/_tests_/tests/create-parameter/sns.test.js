const snsParameter = require('../../../create-parameter/sns');
const mockRequest = require('../../fixtures/response/fetchTransaction.json');

describe('snsParameter: createParameter', () => {
  const events = mockRequest.Items[0];
  test('With Data: Success', () => {
    const parameters = snsParameter.createParameter(events, 'description', ['endsWithDate']);
    expect(parameters).not.toBeUndefined();
    expect(parameters.Message).not.toBeUndefined();
    expect(parameters.MessageAttributes).not.toBeUndefined();
    expect(parameters.MessageAttributes.account).not.toBeUndefined();
    expect(parameters.MessageAttributes.amount).not.toBeUndefined();
    expect(parameters.MessageAttributes.category).not.toBeUndefined();
    expect(parameters.MessageAttributes.categoryName).not.toBeUndefined();
    expect(parameters.MessageAttributes.categoryType).not.toBeUndefined();
    expect(parameters.MessageAttributes.description).not.toBeUndefined();
    expect(parameters.MessageAttributes.next_scheduled).not.toBeUndefined();
    expect(parameters.MessageAttributes.recurrence).not.toBeUndefined();
    expect(parameters.MessageAttributes.tags).not.toBeUndefined();
    expect(parameters.MessageAttributes.walletId).not.toBeUndefined();
  });
});
