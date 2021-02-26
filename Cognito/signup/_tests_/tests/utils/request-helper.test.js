const util = require('../../../utils/request-helper');

describe('extractVariablesFromRequest', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].firstname = 'Nagarjun';
  event['body-json'].lastname = 'Nagesh';
  event['body-json'].password = '12345678';
  event['body-json'].username = 'nagarjun_nagesh@outlook.com';
  event.params = {};
  event.params.header = {};
  event.params.header['Accept-Language'] = 'en';
  test('With Data: Success', () => {
    const parameters = util.extractVariablesFromRequest(event);
    expect(parameters).not.toBeNull();
    expect(parameters.email).toBe(event['body-json'].username);
    expect(parameters.username).toBe(event['body-json'].firstname);
    expect(parameters.surname).toBe(event['body-json'].lastname);
    expect(parameters.password).toBe(event['body-json'].password);
    expect(parameters.accepLanguage).toBe(event.params.header['Accept-Language']);
  });

  test('Without Data: Success', () => {
    const EN_IN = 'en-IN';
    const parameters = util.extractVariablesFromRequest({
      'body-json': {},
      params: {
        header: {
          'Accept-Language': EN_IN,
        },
      },
    });
    expect(parameters).not.toBeNull();
    expect(parameters.accepLanguage).toBe(EN_IN);
  });
});
