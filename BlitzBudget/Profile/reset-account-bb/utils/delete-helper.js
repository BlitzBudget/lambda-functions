function DeleteHelper() {}

const deleteUser = require('../cognito/delete-user');
const constants = require('../constants/constant');
const globalSignout = require('../cognito/global-signout');

const paramsDelete = {
  UserPoolId: constants.USER_POOL_ID,
  /* required */
};

function isDeleteAccount(event) {
  return event['body-json'].deleteAccount;
}

function handleDeleteAccount(event, cognitoIdServiceProvider) {
  const events = [];
  paramsDelete.Username = event['body-json'].userName;

  if (isDeleteAccount(event)) {
    events.push(globalSignout.globalSignoutFromAllDevices(event, cognitoIdServiceProvider));
    events.push(deleteUser.deleteCognitoAccount(paramsDelete, cognitoIdServiceProvider));
  }

  return events;
}

DeleteHelper.prototype.handleDeleteAccount = handleDeleteAccount;

// Export object
module.exports = new DeleteHelper();
