const deleteRequestParameter = require('../../../create-parameter/delete-request');

describe('DeleteRequestParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameters = deleteRequestParameter.createParameter('primaryKey', 'secondaryKey');
    expect(parameters).not.toBeUndefined();
    expect(parameters.DeleteRequest).not.toBeUndefined();
    expect(parameters.DeleteRequest.Key).not.toBeUndefined();
    expect(parameters.DeleteRequest.Key.pk).not.toBeUndefined();
    expect(parameters.DeleteRequest.Key.sk).not.toBeUndefined();
  });
});
