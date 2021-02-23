const FetchHelper = () => {};

const helper = require('./helper');
const adminGetUser = require('../user/admin-get-user-attribute');

async function fetchUser(event) {
  let userAttr;
  const params = helper.createParameters(event); /* required */

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
