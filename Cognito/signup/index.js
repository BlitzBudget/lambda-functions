const signupHelper = require('./utils/signup-helper');

exports.handler = async (event) => {
  console.log('The event is ', JSON.stringify(event));

  const response = await signupHelper.signupUser(event);

  return response;
};
