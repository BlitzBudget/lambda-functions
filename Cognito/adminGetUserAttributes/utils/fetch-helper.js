function FetchHelper() {}

const userAttributeHelper = require('../create-parameter/user-attribute');
const adminGetUser = require('../cognito/admin-get-user-attribute');

async function fetchUser(event) {
  let userAttr;
  const params = userAttributeHelper.createParameter(event); /* required */

  await adminGetUser.getUser(params).then(
    (result) => {
      userAttr = result;
    },
    (err) => {
      throw new Error(`Error getting user attributes from cognito  ${err}`);
    },
  );
  return userAttr;
}

FetchHelper.prototype.fetchUser = fetchUser;

// Export object
module.exports = new FetchHelper();
