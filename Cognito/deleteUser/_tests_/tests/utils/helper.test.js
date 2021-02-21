const helper = require('../../../utils/helper');

describe('createParameter', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].accessToken = 'notempty';

  test('With Data: Success', () => {
    const parameters = helper.createParameters(event);
    const accessToken = parameters.AccessToken;
    expect(accessToken).not.toBeNull();
  });
});
