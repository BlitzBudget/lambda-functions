const deleteParameter = require('../../../create-parameter/delete');

describe('deleteParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameters = deleteParameter.createParameter('walletId', 'secondaryKey');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.Key.pk).not.toBeUndefined();
    expect(parameters.Key.sk).not.toBeUndefined();
  });
});
