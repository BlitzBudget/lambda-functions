const helper = require('../utils/helper');

module.exports.createParameter = (event, params, index) => {
  const parameter = params;
  let i = index;
  if (util.isNotEmpty(event['body-json'].family_name)) {
    parameter.UserAttributes[i] = {
      Name: 'family_name',
      Value: event['body-json'].family_name,
    };
    i += 1;
  }
  return i;
};
