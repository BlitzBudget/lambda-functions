const loginParameter = require('../../../create-parameter/login');
const constants = require('../../../constants/constant');

describe('Login Parameter', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].password = '12345678';
  event['body-json'].username = 'nagarjun_nagesh@outlook.com';
  test('Build Param for signup', () => {
    const parameters = loginParameter.createParameter(event);
    expect(parameters.AuthFlow).toBe(constants.AUTH_FLOW);
    expect(parameters.ClientId).toBe(process.env.USER_POOL_ID);
    expect(parameters.AuthParameters.USERNAME).toBe(event['body-json'].username);
    expect(parameters.AuthParameters.PASSWORD).toBe(event['body-json'].password);
  });
});
