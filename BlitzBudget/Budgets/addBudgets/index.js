const helper = require('./utils/helper');
const addHelper = require('./utils/add-helper');

exports.handler = async (event) => {
  console.log('adding Budget for ', JSON.stringify(event['body-json']));
  const today = helper.convertToDate(event);
  const { walletId, dateMeantFor } = helper.extractVariablesFromRequest(event);
  helper.throwErrorIfEmpty(event, walletId);

  const { dateId, events } = await addHelper
    .creatDateIfNecessary(dateMeantFor, event, walletId);
  const categoryResponse = await addHelper.createCategoryIfNecessary(
    event,
    today,
    events,
  );
  const newBudgetId = await addHelper.addBudgetIfNotAlreadyPresent(
    categoryResponse.hasNewCategoryBeenCreated,
    today,
    event,
    events,
  );

  const response = event;
  response['body-json'].budgetId = newBudgetId;
  response['body-json'].dateMeantFor = dateId;
  response['body-json'].category = categoryResponse.categoryId;
  return response;
};
