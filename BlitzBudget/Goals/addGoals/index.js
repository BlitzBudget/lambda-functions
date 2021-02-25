const helper = require('./utils/helper');

exports.handler = async (event) => {
  console.log('adding goals for ', JSON.stringify(event['body-json']));
  await helper.handleAddNewGoal(event);
  return event;
};
