function Signup() {}

const requestHelper = require('../utils/request-helper');
const constants = require('../constants/constant');

Signup.prototype.createParameter = (
  event,
) => {
  const {
    email, username, surname, acceptLanguage, password,
  } = requestHelper.extractVariablesFromRequest(event);

  return {
    ClientId: process.env.CLIENT_ID,
    /* required */
    Password: password,
    /* required */
    Username: email,
    /* required */
    UserAttributes: [
      {
        Name: constants.EMAIL,
        /* required */
        Value: email,
      },
      {
        Name: constants.NAME,
        /* required */
        Value: username,
      },
      {
        Name: constants.FAMILY_NAME,
        /* required */
        Value: surname,
      },
      {
        Name: constants.LOCALE,
        /* required */
        Value: acceptLanguage,
      },
      {
        Name: constants.FINANCIAL_PORTFOLIO_ID,
        /* required */
        Value: `${constants.USER_ID}${new Date().toISOString()}`,
      },
      {
        Name: constants.FILE_FORMAT,
        /* required */
        Value: constants.XLS,
      },
    ],
  };
};

// Export object
module.exports = new Signup();
