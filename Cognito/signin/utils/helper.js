const AWS = require('aws-sdk');
const loginHelper = require('./login-helper');
const constants = require('../constants/constant');
const fetchWalletHelper = require('./fetch-wallet-helper');
const fetchUserHelper = require('./fetch-user-helper');

AWS.config.update({ region: constants.AWS_LAMBDA_REGION });
// Create the DynamoDB service object
const dynamoDB = new AWS.DynamoDB();
const documentClient = new dynamoDB.DocumentClient();
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

async function formulateResponse(event) {
  const response = await loginHelper.cognitoLogin(event, cognitoidentityserviceprovider);

  if (event['body-json'].checkPassword === true) {
    return response;
  }

  await fetchUserHelper.fetchUserFromCognito(response, cognitoidentityserviceprovider);

  await fetchWalletHelper.fetchWalletFromUser(response, documentClient);

  return response;
}

module.exports.formulateResponse = formulateResponse;
