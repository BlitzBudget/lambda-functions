function UserAttribute() {}

const currencyParameter = require('./currency');
const familyNameParameter = require('./family-name');
const fileFormatParameter = require('./file-format');
const nameParameter = require('./name');
const emailParameter = require('./email');
const localeParameter = require('./locale');

// Build parameter
UserAttribute.prototype.createParameter = (event) => {
  const email = event['body-json'].username;
  const params = emailParameter.createParameter(email);

  params.UserAttributes = [];
  let index = 0;

  // If the name attribute is present
  index = nameParameter.createParameter(event, params, index);

  // If the family name is present
  index = familyNameParameter.createParameter(event, params, index);

  // If locale is present
  index = localeParameter.createParameter(event, params, index);

  // If currency is present
  index = currencyParameter.createParameter(event, params, index);

  // If exportFileFormat is present
  fileFormatParameter.createParameter(event, params, index);

  return params;
};

// Export object
module.exports = new UserAttribute();
