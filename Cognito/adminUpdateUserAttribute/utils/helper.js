const Helper = () => {};

const userPoolId = 'eu-west-1_cjfC8qNiB';

const isEmpty = (obj) => {
  // Check if objext is a number or a boolean
  if (typeof obj === 'number' || typeof obj === 'boolean') return false;

  // Check if obj is null or undefined
  if (obj === null || obj === undefined) return true;

  // Check if the length of the obj is defined
  if (typeof obj.length !== 'undefined') return obj.length === 0;

  // check if obj is a custom obj
  if (obj
&& Object.keys(obj).length !== 0) { return false; }

  return true;
};

const isNotEmpty = (obj) => !isEmpty(obj);

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
  if (isNotEmpty(event['body-json'].name)) {
    params.UserAttributes[index] = {
      Name: 'name',
      /* required */
      Value: event['body-json'].name,
    };
    index += 1;
  }

  // If the family name is present
  if (isNotEmpty(event['body-json'].family_name)) {
    params.UserAttributes[index] = {
      Name: 'family_name',
      Value: event['body-json'].family_name,
    };
    index += 1;
  }

  // If locale is present
  if (isNotEmpty(event['body-json'].locale)) {
    params.UserAttributes[index] = {
      Name: 'locale',
      Value: event['body-json'].locale,
    };
    index += 1;
  }

  // If currency is present
  if (isNotEmpty(event['body-json'].currency)) {
    params.UserAttributes[index] = {
      Name: 'custom:currency',
      Value: event['body-json'].currency,
    };
    index += 1;
  }

  // If exportFileFormat is present
  if (isNotEmpty(event['body-json'].exportFileFormat)) {
    params.UserAttributes[index] = {
      Name: 'custom:exportFileFormat',
      Value: event['body-json'].exportFileFormat,
    };
    index += 1;
  }

  return params;
};

Helper.prototype.isEmpty = isEmpty;
Helper.prototype.isNotEmpty = isNotEmpty;

// Export object
module.exports = new Helper();
