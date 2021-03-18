const mockSuccess = require('../_tests_ /fixtures/response/success');

module.exports = () => ({
  config: {
    update: jest.fn(),
  },
  CognitoIdentityServiceProvider: jest.fn(() => ({
    initiateAuth: (parameters) => jest.fn()
      .mockReturnValueOnce(mockSuccess(parameters)),
  })),
});
