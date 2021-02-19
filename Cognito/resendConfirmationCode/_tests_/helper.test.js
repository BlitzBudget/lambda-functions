const helper = require('../helper');

describe('createParameter', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].username = 'notempty';

  test('With Data: Success', () => {
    const parameters = helper.createParameter(event);
    const clientId = parameters.ClientId;
    const username = parameters.Username;
    expect(clientId).not.toBeNull();
    expect(username).not.toBeNull();
  });
});
