const AWS = require('aws-sdk');

const helper = require('./utils/helper');
const fetchUser = require('./fetch/user');
const fetchWallet = require('./fetch/wallet');
const login = require('./cognito/login');

AWS.config.update({ region: 'eu-west-1' });
// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

// Fetch Wallets
async function fetchWalletFromUser(response) {
  const userIdParam = helper.fetchUserId(response);
  await fetchWallet.getWallet(userIdParam, docClient).then(
    (result) => {
      response.Wallet = result;
      console.log(`logged in the user ${JSON.stringify(result.walletId)}`);
    },
    (err) => {
      throw new Error(`Unable to get the wallet at the moment  ${err}`);
    },
  );
}

// Fetch Users
async function fetchUserFromCognito(response) {
  await fetchUser.getUser(response, cognitoidentityserviceprovider).then(
    (result) => {
      response.Username = result.Username;
      response.UserAttributes = result.UserAttributes;
      console.log(`logged in the user ${JSON.stringify(result.Username)}`);
    },
    (err) => {
      throw new Error(`Unable to signin from cognito  ${err}`);
    },
  );
}

// Login to user
async function loginToCognito(event, response) {
  let loginResponse = response;
  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g',
    AuthParameters: {
      USERNAME: event['body-json'].username,
      PASSWORD: event['body-json'].password,
    },
  };

  await login.initiateAuth(params, cognitoidentityserviceprovider).then(
    (result) => {
      loginResponse = result;
    },
    (err) => {
      throw new Error(`Unable to signin from cognito  ${err}`);
    },
  );
  return loginResponse;
}

exports.handler = async (event) => {
  let response = {};
  response = await loginToCognito(event, response);

  if (event['body-json'].checkPassword === true) {
    return response;
  }

  await fetchUserFromCognito(response);

  await fetchWalletFromUser(response);

  return response;
};
