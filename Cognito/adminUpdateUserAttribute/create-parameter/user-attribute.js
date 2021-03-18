function UserAttribute() {}

const helper = require('../utils/helper');
const constants = require('../constants/constant');

function createFileFormatParameter(event, params, index) {
  const parameter = params;
  let i = index;
  if (helper.isNotEmpty(event['body-json'].exportFileFormat)) {
    parameter.UserAttributes[i] = {
      Name: 'custom:exportFileFormat',
      Value: event['body-json'].exportFileFormat,
    };
    i += 1;
  }
  return i;
}

function createCurrencyParameter(event, params, index) {
  const parameter = params;
  let i = index;
  if (helper.isNotEmpty(event['body-json'].currency)) {
    parameter.UserAttributes[i] = {
      Name: 'custom:currency',
      Value: event['body-json'].currency,
    };
    i += 1;
  }
  return i;
}

function createLocaleParameter(event, params, index) {
  const parameter = params;
  let i = index;
  if (helper.isNotEmpty(event['body-json'].locale)) {
    parameter.UserAttributes[i] = {
      Name: 'locale',
      Value: event['body-json'].locale,
    };
    i += 1;
  }
  return i;
}

function createFamilyNameParameter(event, params, index) {
  const parameter = params;
  let i = index;
  if (helper.isNotEmpty(event['body-json'].family_name)) {
    parameter.UserAttributes[i] = {
      Name: 'family_name',
      Value: event['body-json'].family_name,
    };
    i += 1;
  }
  return i;
}

function createNameParameter(event, params, index) {
  const parameter = params;
  let i = index;
  if (helper.isNotEmpty(event['body-json'].name)) {
    parameter.UserAttributes[i] = {
      Name: 'name',
      /* required */
      Value: event['body-json'].name,
    };
    i += 1;
  }
  return i;
}

// Build parameter
UserAttribute.prototype.createParameter = (event) => {
  const email = event['body-json'].username;
  const params = {
    UserPoolId: constants.USER_POOL_ID,
    /* required */
    Username: email,
    /* required */
  };

  params.UserAttributes = [];
  let index = 0;

  // If the name attribute is present
  index = createNameParameter(event, params, index);

  // If the family name is present
  index = createFamilyNameParameter(event, params, index);

  // If locale is present
  index = createLocaleParameter(event, params, index);

  // If currency is present
  index = createCurrencyParameter(event, params, index);

  // If exportFileFormat is present
  createFileFormatParameter(event, params, index);

  return params;
};

// Export object
module.exports = new UserAttribute();
