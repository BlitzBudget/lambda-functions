function Transaction() {}

const util = require('../utils/util');
const helper = require('../utils/helper');
const transactionParameter = require('../create-parameter/transaction');
const setRecurrenceDates = require('./set-recurrence-date');

function calculateCategory(compareString, sk, categoryMap, category) {
  if (util.isNotEmpty(categoryMap[compareString])) {
    console.log(
      'The category for the transaction %j ',
      sk,
      ' is ',
      categoryMap[compareString],
    );
    return categoryMap[compareString];
  }

  return category;
}

function calculateDateMeanFor(compareString, sk, datesMap, dateMeantFor) {
  if (util.isNotEmpty(datesMap[compareString])) {
    console.log(
      'The date for the transaction %j ',
      sk,
      ' is ',
      datesMap[compareString],
    );
    return datesMap[compareString];
  }

  return dateMeantFor;
}

function createTransactionPutRequest(
  createTransactionArray, sk, walletId, recurrence, amount, description,
  category, account, tags, dateMeantFor, futureDatesToCreate,
) {
  createTransactionArray.push(transactionParameter.createParameter(walletId,
    sk,
    recurrence,
    amount,
    description,
    category,
    account,
    tags,
    dateMeantFor,
    futureDatesToCreate));
}

/*
 * Populate the date meant for attribute in the transactions
 */
function constructTransactions(
  datesMap,
  categoryMap,
  event,
  createTransactionArray,
) {
  const {
    futureDateToCreate,
    today,
    walletId,
    recurrence,
    amount,
    description,
    account,
    tags,
  } = helper.extractVariablesFromRequestForTransaction(event);
  let category = event.Records[0].Sns.MessageAttributes.category.Value;
  let dateMeantFor;
  const futureDatesToCreate = new Date(futureDateToCreate);

  while (futureDatesToCreate.getTime() < today.getTime()) {
    const sk = `Transaction#${futureDatesToCreate.toISOString()}`;

    const compareString = sk.substring(12, 19);
    dateMeantFor = calculateDateMeanFor(compareString, sk, datesMap, dateMeantFor);
    category = calculateCategory(compareString, sk, categoryMap);
    createTransactionPutRequest(
      createTransactionArray, sk, walletId, recurrence, amount, description,
      category, account, tags, dateMeantFor, futureDatesToCreate,
    );

    setRecurrenceDates.setRecurrenceDates(futureDatesToCreate, recurrence);
  }
}

Transaction.prototype.constructTransactions = constructTransactions;
// Export object
module.exports = new Transaction();
