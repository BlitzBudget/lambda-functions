const patchGoals = require('./patch/goal');

exports.handler = async (event) => {
  console.log('updating goals for ', JSON.stringify(event['body-json']));
  await patchGoals.updatingGoals(event).then(
    () => {
      console.log('successfully saved the new goals');
    },
    (err) => {
      throw new Error(`Unable to add the goals ${err}`);
    },
  );

  return event;
};
