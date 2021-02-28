function Signup() {}

const requestHelper = require('../utils/request-helper');
const constants = require('../constants/constant');

Signup.prototype.createParameter = (
  event,
) => {
  const {
    email, firstName, lastName, accepLanguage, password,
  } = requestHelper.extractVariablesFromRequest(event);

  return {
    ClientId: constants.CLIENT_ID,
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
        Value: firstName,
      },
      {
        Name: constants.FAMILY_NAME,
        /* required */
        Value: lastName,
      },
      {
        Name: constants.LOCALE,
        /* required */
        Value:
        accepLanguage.length <= 4
          ? accepLanguage.substring(1, 3)
          : accepLanguage.substring(1, 6) /* take en or en-US if available */,
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