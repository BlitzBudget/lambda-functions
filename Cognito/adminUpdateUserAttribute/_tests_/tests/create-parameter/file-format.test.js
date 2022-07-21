const mockUserAttributeRequest = require('.../../../fixtures/request/updateExportFileFormat.json');
const mockUserCurrencyRequest = require('.../../../fixtures/request/updateUserCurrency.json');
const fileFormatParameter = require('../../../create-parameter/file-format');

describe('mockExportFileFormatRequest', () => {
  const event = mockUserAttributeRequest;
  const parameter = { UserAttributes: [] };

  test('With Data: Success', () => {
    const index = fileFormatParameter.createParameter(event, parameter, 0);
    expect(index).not.toBeUndefined();
    expect(index).toBe(1);
    expect(parameter.UserAttributes).not.toBeUndefined();
    expect(parameter.UserAttributes[0]).not.toBeUndefined();
    expect(parameter.UserAttributes[0].Name).toBe('custom:exportFileFormat');
  });
});

describe('mockExportFileFormatRequest: False Data ', () => {
  const event = mockUserCurrencyRequest;
  const parameter = { UserAttributes: [] };

  test('With Data: Success', () => {
    const index = fileFormatParameter.createParameter(event, parameter, 0);
    expect(index).not.toBeUndefined();
    expect(index).toBe(0);
    expect(parameter.UserAttributes.length).toBe(0);
  });
});
