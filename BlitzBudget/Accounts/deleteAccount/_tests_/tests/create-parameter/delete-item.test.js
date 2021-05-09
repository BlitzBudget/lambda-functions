const deleteRequestParameter = require('../../../create-parameter/delete-request');
const deleteItemParameter = require('../../../create-parameter/delete-item');

describe('DeleteRequestParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameter = deleteRequestParameter.createParameter('primaryKey', 'secondaryKey');
    const parameters = deleteItemParameter.createParameter(parameter);
    expect(parameters).not.toBeUndefined();
    expect(parameters.RequestItems).not.toBeUndefined();
    expect(parameters.RequestItems.blitzbudget).not.toBeUndefined();
  });
});
