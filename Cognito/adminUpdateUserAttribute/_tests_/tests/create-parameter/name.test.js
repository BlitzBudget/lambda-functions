const nameParameter = require('../../../create-parameter/name');
const mockUserAttributeRequest = require('.../../../fixtures/request/updateUserAttributes');
const mockUserCurrencyRequest = require('.../../../fixtures/request/updateUserCurrency');

describe('mockNameRequest', () => {
  const event = mockUserAttributeRequest;
  const parameter = { UserAttributes: [] };

  test('With Data: Success', () => {
    const index = nameParameter.createParameter(event, parameter, 0);
    expect(index).not.toBeUndefined();
    expect(index).toBe(1);
    expect(parameter.UserAttributes).not.toBeUndefined();
    expect(parameter.UserAttributes[0]).not.toBeUndefined();
    expect(parameter.UserAttributes[0].Name).toBe('name');
  });
});

describe('mockNameRequest: False Data', () => {
  const event = mockUserCurrencyRequest;
  const parameter = { UserAttributes: [] };

  test('With Data: Success', () => {
    const index = nameParameter.createParameter(event, parameter, 0);
    expect(index).not.toBeUndefined();
    expect(index).toBe(0);
    expect(parameter.UserAttributes.length).toBe(0);
  });
});
