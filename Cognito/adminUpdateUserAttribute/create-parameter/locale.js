const helper = require('../utils/helper');

module.exports.createParameter = (event, params, index) => {
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
};
