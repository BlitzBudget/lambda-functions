function Helper() {}

const userPoolId = 'eu-west-1_cjfC8qNiB';

const isEmpty = (obj) => {
  // Check if objext is a number or a boolean
  if (typeof obj === 'number' || typeof obj === 'boolean') return false;

  // Check if obj is null or undefined
  if (obj === null || obj === undefined) return true;

  // Check if the length of the obj is defined
  if (typeof obj.length !== 'undefined') return obj.length === 0;

  // check if obj is a custom obj
  if (obj && Object.keys(obj).length !== 0) { return false; }

  return true;
};

const isNotEmpty = (obj) => !isEmpty(obj);

function createFileFormatParameter(event, params, index) {
  const parameter = params;
  let i = index;
  if (isNotEmpty(event['body-json'].exportFileFormat)) {
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
  if (isNotEmpty(event['body-json'].currency)) {
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
  if (isNotEmpty(event['body-json'].locale)) {
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
  if (isNotEmpty(event['body-json'].family_name)) {
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
  if (isNotEmpty(event['body-json'].name)) {
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
Helper.prototype.buildParams = (event) => {
  const email = event['body-json'].username;
  const params = {
    UserPoolId: userPoolId,
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

Helper.prototype.isEmpty = isEmpty;
Helper.prototype.isNotEmpty = isNotEmpty;

// Export object
module.exports = new Helper();
