const mockExportFileFormatRequest = require('.../../../fixtures/request/updateExportFileFormat.json');
const mockUserAttributeRequest = require('.../../../fixtures/request/updateUserAttributes.json');
const mockUserCurrencyRequest = require('.../../../fixtures/request/updateUserCurrency.json');
const mockUserLocaleRequest = require('.../../../fixtures/request/updateUserLocale.json');
const userAttributeParameter = require('../../../create-parameter/user-attribute');

describe('mockExportFileFormatRequest', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
    process.env.USER_POOL_ID = '3';
  });
  const event = mockExportFileFormatRequest;

  test('With Data: Success', () => {
    const parameters = userAttributeParameter.createParameter(event);
    expect(parameters).not.toBeUndefined();
    expect(parameters.UserPoolId).not.toBeUndefined();
    expect(parameters.Username).not.toBeUndefined();
    expect(parameters.UserAttributes).not.toBeUndefined();
    expect(parameters.UserAttributes[0]).not.toBeUndefined();
    expect(parameters.UserAttributes[0].Name).toBe('custom:exportFileFormat');
  });
});

describe('mockUserAttributeRequest', () => {
  const event = mockUserAttributeRequest;

  test('With Data: Success', () => {
    const parameters = userAttributeParameter.createParameter(event);
    expect(parameters).not.toBeUndefined();
    expect(parameters.UserPoolId).not.toBeUndefined();
    expect(parameters.Username).not.toBeUndefined();
    expect(parameters.UserAttributes).not.toBeUndefined();
    expect(parameters.UserAttributes[0]).not.toBeUndefined();
    expect(parameters.UserAttributes[0].Name).toBe('name');
    expect(parameters.UserAttributes[1]).not.toBeUndefined();
    expect(parameters.UserAttributes[1].Name).toBe('family_name');
  });
});

describe('mockUserCurrencyRequest', () => {
  const event = mockUserCurrencyRequest;

  test('With Data: Success', () => {
    const parameters = userAttributeParameter.createParameter(event);
    expect(parameters).not.toBeUndefined();
    expect(parameters.UserPoolId).not.toBeUndefined();
    expect(parameters.Username).not.toBeUndefined();
    expect(parameters.UserAttributes).not.toBeUndefined();
    expect(parameters.UserAttributes[0]).not.toBeUndefined();
    expect(parameters.UserAttributes[0].Name).toBe('custom:currency');
  });
});

describe('mockUserLocaleRequest', () => {
  const event = mockUserLocaleRequest;

  test('With Data: Success', () => {
    const parameters = userAttributeParameter.createParameter(event);
    expect(parameters).not.toBeUndefined();
    expect(parameters.UserPoolId).not.toBeUndefined();
    expect(parameters.Username).not.toBeUndefined();
    expect(parameters.UserAttributes).not.toBeUndefined();
    expect(parameters.UserAttributes[0]).not.toBeUndefined();
    expect(parameters.UserAttributes[0].Name).toBe('locale');
  });
});
