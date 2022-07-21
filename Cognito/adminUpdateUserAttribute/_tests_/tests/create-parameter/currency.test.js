const mockUserCurrencyRequest = require('.../../../fixtures/request/updateUserCurrency.json');
const mockUserAttributeRequest = require('.../../../fixtures/request/updateUserAttributes.json');
const currencyParameter = require('../../../create-parameter/currency');

describe('mockUserCurrencyRequest', () => {
  const event = mockUserCurrencyRequest;
  const parameter = { UserAttributes: [] };

  test('With Data: Success', () => {
    const index = currencyParameter.createParameter(event, parameter, 0);
    expect(index).not.toBeUndefined();
    expect(index).toBe(1);
    expect(parameter.UserAttributes).not.toBeUndefined();
    expect(parameter.UserAttributes[0]).not.toBeUndefined();
    expect(parameter.UserAttributes[0].Name).toBe('custom:currency');
  });
});

describe('mockNameRequest', () => {
  const event = mockUserAttributeRequest;
  const parameter = { UserAttributes: [] };

  test('With Data: Success', () => {
    const index = currencyParameter.createParameter(event, parameter, 0);
    expect(index).not.toBeUndefined();
    expect(index).toBe(0);
    expect(parameter.UserAttributes).not.toBeUndefined();
    expect(parameter.UserAttributes.length).toBe(0);
  });
});
