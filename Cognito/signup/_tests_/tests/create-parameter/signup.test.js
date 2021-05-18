const signupParameter = require('../../../create-parameter/signup');
const constants = require('../../../constants/constant');

describe('buildParamForSignup', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].firstname = 'Nagarjun';
  event['body-json'].lastname = 'Nagesh';
  event['body-json'].password = '12345678';
  event['body-json'].username = 'nagarjun_nagesh@outlook.com';
  event.params = {};
  event.params.header = {};
  event.params.header['Accept-Language'] = '"en"';
  test('Build Param for signup', () => {
    const parameters = signupParameter.createParameter(event);
    expect(parameters.ClientId).toBe(process.env.USER_POOL_ID);
    expect(parameters.Username).toBe(event['body-json'].username);
    expect(parameters.UserAttributes[1].Value).toBe(event['body-json'].firstname);
    expect(parameters.UserAttributes[2].Value).toBe(event['body-json'].lastname);
    expect(parameters.Password).toBe(event['body-json'].password);
    expect(parameters.UserAttributes[3].Value).toBe('en');
    expect(parameters.UserAttributes[4].Value).toContain(constants.USER_ID);
    expect(parameters.UserAttributes[5].Value).toBe(constants.XLS);
  });
});
