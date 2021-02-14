const helper = require('utils/helper');
const adminUpdateUser = require('user/admin-update-user-attributes');

exports.handler = async (event) => {
  //console.log("event - " + JSON.stringify(event));

  await handleAdminUpdateUserAttributes(event);

  return event;
};

async function handleAdminUpdateUserAttributes(event) {
  let params = helper.buildParams(event);

  await adminUpdateUser.updateAttributes(params).then(
    function (result) {
      // Success function
      console.log('Successfully updated the attribute');
    },
    function (err) {
      throw new Error('Unable to update the userattributes. ' + err);
    }
  );
}
