const util = require('../../../utils/signup-helper');
const mockSuccess = require('../../fixtures/response/success');

jest.mock('../../../cognito/signup', () => ({
  signup: (parameters) => Promise.resolve(mockSuccess(parameters)),
}));

describe('signupUser', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].firstname = 'Nagarjun';
  event['body-json'].lastname = 'Nagesh';
  event['body-json'].password = '12345678';
  event['body-json'].username = 'nagarjun_nagesh@outlook.com';
  event.params = {};
  event.params.header = {};
  event.params.header['Accept-Language'] = 'en';
  test('With Data: Success', () => util.signupUser(event).then((response) => {
    expect(response).not.toBeNull();
    expect(response.UserConfirmed).not.toBeNull();
    expect(response.UserConfirmed).toBe(false);
  }));
});
