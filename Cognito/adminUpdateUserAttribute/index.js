const updateHelper = require('./utils/update-helper');

exports.handler = async (event) => {
  await updateHelper.updateUserAttributes(event);
  return event;
};
