const deleteParameter = require('../../../create-parameter/delete');

describe('deleteParameter: createParameter', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
  });

  test('With Data: Success', () => {
    const parameters = deleteParameter.createParameter('walletId', 'secondaryKey');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.Key.pk).not.toBeUndefined();
    expect(parameters.Key.sk).not.toBeUndefined();
  });
});
