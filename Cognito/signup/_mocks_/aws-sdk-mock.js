const mockSuccess = require('../_tests_/fixtures/response/success');
const mockUsernameExistsException = require('../_tests_/fixtures/response/user-already-exists');

module.exports = () => ({
  config: {
    update: jest.fn(),
  },
  CognitoIdentityServiceProvider: jest.fn(() => ({
    signUp: (parameters) => jest.fn()
      .mockReturnValueOnce(mockSuccess(parameters))
      .mockReturnValueOnce(mockUsernameExistsException),
  })),
});
