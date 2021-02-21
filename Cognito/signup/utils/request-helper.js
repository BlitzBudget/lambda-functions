function RequestHelper() {}

const helper = require('./helper');

RequestHelper.prototype.extractVariablesFromRequest = (event) => {
  let { firstname } = event['body-json'];
  let { lastname } = event['body-json'];
  const { password } = event['body-json'];
  const email = helper.emailToLowerCase(event['body-json'].username);
  const accepLanguage = JSON.stringify(event.params.header['Accept-Language']);

  ({ firstname, lastname } = helper.extractFirstAndLastName(
    firstname,
    lastname,
    email,
  ));

  return {
    email, firstname, lastname, accepLanguage, password,
  };
};

// Export object
module.exports = new RequestHelper();
