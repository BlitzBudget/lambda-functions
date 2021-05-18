const addBankParameter = require('../../../create-parameter/add-bank-account');
const mockRequest = require('../../fixtures/request/processBlitzBudgetTable');

describe('addBankParameter: createParameter', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
  });
  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = addBankParameter.createParameter(event.Records[0], 'randomValue');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.Item).not.toBeUndefined();
    expect(parameters.Item.pk).not.toBeUndefined();
    expect(parameters.Item.sk).not.toBeUndefined();
    expect(parameters.Item.account_balance).not.toBeUndefined();
    expect(parameters.Item.account_type).not.toBeUndefined();
    expect(parameters.Item.bank_account_name).not.toBeUndefined();
    expect(parameters.Item.linked).not.toBeUndefined();
    expect(parameters.Item.account_sub_type).not.toBeUndefined();
    expect(parameters.Item.selected_account).not.toBeUndefined();
    expect(parameters.Item.primary_wallet).not.toBeUndefined();
    expect(parameters.Item.creation_date).not.toBeUndefined();
    expect(parameters.Item.updated_date).not.toBeUndefined();
  });
});
