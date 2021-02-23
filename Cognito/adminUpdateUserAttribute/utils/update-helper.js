function UpdateHelper() {}

const userAttributeParameter = require('../create-parameter/user-attribute');
const adminUpdateUser = require('../user/admin-update-user-attributes');

async function updateUserAttributes(event) {
  const params = userAttributeParameter.createParameter(event);

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

UpdateHelper.prototype.updateUserAttributes = updateUserAttributes;

// Export object
module.exports = new UpdateHelper();
