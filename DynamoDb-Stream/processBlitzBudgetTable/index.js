console.log('Loading function');

const updateHelper = require('./utils/update-helper');

exports.handler = async (event) => {
  updateHelper.updateRelevantItems(event);

  return `Successfully processed ${event.Records.length} records.`;
};
