const helper = require('helper');
const deletUser = require('delete-user');

const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  let response = {};
  var params = helper.createParameters(event);

  response = await handleDeleteUser(params, response);

  return response;
};

async function handleDeleteUser(params, response) {
  await deletUser.handleDeleteUser(params).then(
    function (result) {
      response = result;
    },
    function (err) {
      throw new Error('Unable to delete user from cognito  ' + err);
    }
  );
  return response;
}
