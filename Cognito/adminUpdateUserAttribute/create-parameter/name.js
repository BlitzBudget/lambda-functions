const util = require('../utils/util');

module.exports.createParameter = (event, params, index) => {
  const parameter = params;
  let i = index;
  if (util.isNotEmpty(event['body-json'].name)) {
    parameter.UserAttributes[i] = {
      Name: 'name',
      /* required */
      Value: event['body-json'].name,
    };
    i += 1;
  }
  return i;
};
