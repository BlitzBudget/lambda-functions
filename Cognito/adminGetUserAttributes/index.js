const helper = require('./utils/helper');
const adminGetUser = require('./user/admin-get-user-attribute');

async function handleGetUser(event) {
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

exports.handler = async (event) => {
  const response = await handleGetUser(event);
  return response;
};
