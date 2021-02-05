const helper = require('utils/helper');
const adminGetUser = require('user/admin-get-user-attribute');

exports.handler = async (event) => {
    return await handleGetUser(event);
};

async function handleGetUser(event) {
   let userAttr;
   let params = helper.createParameters(event); /* required */
   
   await adminGetUser.getUser(params).then(function (result) {
      userAttr = result;
   }, function (err) {
      throw new Error("Error getting user attributes from cognito  " + err);
   });
   return userAttr;
}

