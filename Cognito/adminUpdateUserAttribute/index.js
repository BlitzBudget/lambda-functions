const helper = require('./utils/helper');
const adminUpdateUser = require('./user/admin-update-user-attributes');

async function handleAdminUpdateUserAttributes(event) {
  const params = helper.buildParams(event);

  await adminUpdateUser.updateAttributes(params).then(
    () => {
      // Success function
      console.log('Successfully updated the attribute');
    },
    (err) => {
      throw new Error(`Unable to update the userattributes. ${err}`);
    },
  );
}

exports.handler = async (event) => {
  // console.log("event - " + JSON.stringify(event));

  await handleAdminUpdateUserAttributes(event);

  return event;
};
