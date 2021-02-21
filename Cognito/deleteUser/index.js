const AWS = require('aws-sdk');
const helper = require('./utils/helper');
const deletUser = require('./cognito/delete-user');

AWS.config.update({ region: 'eu-west-1' });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

async function handleDeleteUser(params, response) {
  let deleteResponse = response;
  await deletUser.handleDeleteUser(params, cognitoidentityserviceprovider).then(
    (result) => {
      deleteResponse = result;
    },
    (err) => {
      throw new Error(`Unable to delete user from cognito  ${err}`);
    },
  );
  return deleteResponse;
}

exports.handler = async (event) => {
  let response = {};
  const params = helper.createParameters(event);

  response = await handleDeleteUser(params, response);

  return response;
};
