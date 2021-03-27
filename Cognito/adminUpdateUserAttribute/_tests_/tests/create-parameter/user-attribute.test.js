const userAttributeParameter = require('../../../create-parameter/user-attribute');
const mockExportFileFormatRequest = require('.../../../fixtures/request/updateExportFileFormat');
const mockUserAttributeRequest = require('.../../../fixtures/request/updateUserAttributes');
const mockUserCurrencyRequest = require('.../../../fixtures/request/updateUserCurrency');
const mockUserLocaleRequest = require('.../../../fixtures/request/updateUserLocale');

describe('mockExportFileFormatRequest', () => {
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
