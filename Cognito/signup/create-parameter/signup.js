function Signup() {}

const helper = require('../utils/helper');

Signup.prototype.createParameter = (
  event,
) => {
  const {
    email, firstName, lastName, accepLanguage, password,
  } = helper.extractVariablesFromRequest(event);

  return {
    ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g',
    /* required */
    Password: password,
    /* required */
    Username: email,
    /* required */
    UserAttributes: [
      {
        Name: 'email',
        /* required */
        Value: email,
      },
      {
        Name: 'name',
        /* required */
        Value: firstName,
      },
      {
        Name: 'family_name',
        /* required */
        Value: lastName,
      },
      {
        Name: 'locale',
        /* required */
        Value:
        accepLanguage.length <= 4
          ? accepLanguage.substring(1, 3)
          : accepLanguage.substring(1, 6) /* take en or en-US if available */,
      },
      {
        Name: 'custom:financialPortfolioId',
        /* required */
        Value: `User#${new Date().toISOString()}`,
      },
      {
        Name: 'custom:exportFileFormat',
        /* required */
        Value: 'XLS',
      },
    ],
  };
};

// Export object
module.exports = new Signup();
