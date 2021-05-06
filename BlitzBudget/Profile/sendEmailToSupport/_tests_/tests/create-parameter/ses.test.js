const sesParameter = require('../../../create-parameter/ses');
const mockRequest = require('../../fixtures/sendSampleEmail.json');

describe('snsParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameters = sesParameter.createParameter(mockRequest);
    expect(parameters).not.toBeUndefined();
    expect(parameters.Destination).not.toBeUndefined();
    expect(parameters.Destination.ToAddresses).not.toBeUndefined();
    expect(parameters.Message).not.toBeUndefined();
    expect(parameters.Message.Body).not.toBeUndefined();
    expect(parameters.Message.Body.Text).not.toBeUndefined();
    expect(parameters.Message.Body.Text.Data).not.toBeUndefined();
    expect(parameters.Message.Subject).not.toBeUndefined();
    expect(parameters.Message.Subject.Data).not.toBeUndefined();
    expect(parameters.ReplyToAddresses).not.toBeUndefined();
    expect(parameters.Source).not.toBeUndefined();
  });
});
