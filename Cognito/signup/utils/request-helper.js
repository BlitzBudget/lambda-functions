function RequestHelper() {}

const helper = require('./helper');

RequestHelper.prototype.extractVariablesFromRequest = (event) => {
  let { username } = event['body-json'];
  let { surname } = event['body-json'];
  const { password } = event['body-json'];
  const email = helper.emailToLowerCase(event['body-json'].username);
  const acceptLanguage = event.params.header['CloudFront-Viewer-Country'];

  ({ username, surname } = helper.extractFirstAndLastName(
    username,
    surname,
    email,
  ));

  return {
    email, username, surname, acceptLanguage, password,
  };
};

// Export object
module.exports = new RequestHelper();
