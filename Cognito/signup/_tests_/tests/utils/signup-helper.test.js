const util = require('../../../utils/signup-helper');

jest.mock('../../../cognito/signup', () => ({
  signup: (parameters) => Promise.resolve(JSON.stringify({
    UserConfirmed: false,
    CodeDeliveryDetails: {
      Destination: parameters.email,
      DeliveryMedium: 'EMAIL',
      AttributeName: 'email',
    },
    UserSub: 'c5f9af98-ebcb-4c9c-8be4-9c1bc6bfbcad',
  })),
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
  }));
});
