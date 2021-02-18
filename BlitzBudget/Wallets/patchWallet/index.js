const updateHelper = require('./utils/update-helper');

exports.handler = async (event) => {
  console.log('updating goals for ', JSON.stringify(event['body-json']));
  await updateHelper.handleUpdateItems(event);

  return event;
};
