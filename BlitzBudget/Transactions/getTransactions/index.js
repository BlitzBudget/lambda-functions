const helper = require('./utils/helper');
const fetchHelper = require('./utils/fetch-helper');
const snsHelper = require('./utils/sns-helper');

exports.handler = async (event) => {
  console.log('fetching item for the walletId ', event['body-json'].walletId);
  const events = [];
  const {
    startsWithDate,
    endsWithDate,
    userId,
  } = helper.extractVariablesFromRequest(event);
  const { fullMonth, percentage } = helper.isFullMonth(startsWithDate, endsWithDate);

  // Cognito does not store wallet information nor curreny. All are stored in wallet.
  const walletId = await fetchHelper.fetchWalletItem(event['body-json'].walletId, userId);

  const { allResponses, snsEvents } = await fetchHelper.fetchAllRelevantItems(
    events,
    walletId,
    startsWithDate,
    endsWithDate,
  );

  const formatedResponses = helper.calculateDateAndCategoryTotal(
    fullMonth, allResponses, percentage,
  );

  await snsHelper.sendSNSToCreateNewTransactions(snsEvents);
  return formatedResponses;
};
