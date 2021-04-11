const deleteParameter = require('../../../create-parameter/delete');

describe('deleteParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameters = deleteParameter.createParameter('walletId');
    expect(parameters).not.toBeUndefined();
    expect(parameters.RequestItems).not.toBeUndefined();
    expect(parameters.RequestItems.blitzbudget).not.toBeUndefined();
  });
});
