const addBankParameter = require('../../../create-parameter/add-budget');
const mockRequest = require('../../fixtures/request/addBudget');

describe('addBankParameter: createParameter', () => {
  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = addBankParameter.createParameter(event, 'randomValue');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.Item).not.toBeUndefined();
    expect(parameters.Item.pk).not.toBeUndefined();
    expect(parameters.Item.sk).not.toBeUndefined();
    expect(parameters.Item.category).not.toBeUndefined();
    expect(parameters.Item.creation_date).not.toBeUndefined();
    expect(parameters.Item.auto_generated).not.toBeUndefined();
    expect(parameters.Item.date_meant_for).not.toBeUndefined();
    expect(parameters.Item.updated_date).not.toBeUndefined();
    expect(parameters.Item.planned).not.toBeUndefined();
  });
});
