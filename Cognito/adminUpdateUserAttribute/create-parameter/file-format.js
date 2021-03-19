const helper = require('../utils/helper');

module.exports.createParameter = (event, params, index) => {
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
};
