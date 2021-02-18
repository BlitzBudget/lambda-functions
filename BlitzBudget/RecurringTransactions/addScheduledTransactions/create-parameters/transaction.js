const Transaction = () => {};

const helper = require('../utils/helper');
/*
 * Populate the date meant for attribute in the transactions
 */
function constructTransactions(
  datesMap,
  categoryMap,
  event,
  addItemArray,
) {
  function extractVariablesFromRequest() {
    const recurrence = event.Records[0].Sns.MessageAttributes.recurrence.Value;
    const walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
    const amount = parseInt(event.Records[0].Sns.MessageAttributes.amount.Value, 10);
    const description = event.Records[0].Sns.MessageAttributes.description.Value;
    const account = event.Records[0].Sns.MessageAttributes.account.Value;
    let { tags } = event.Records[0].Sns.MessageAttributes;

    if (helper.isNotEmpty(tags)) {
      tags = JSON.parse(tags.Value);
      console.log('The tags for the transaction is ', tags);
    }

    const futureDateToCreate = event.Records[0].Sns.MessageAttributes.next_scheduled.Value;
    const today = new Date();
    return {
      futureDateToCreate,
      today,
      walletId,
      recurrence,
      amount,
      description,
      account,
      tags,
    };
  }

  const {
    futureDateToCreate,
    today,
    walletId,
    recurrence,
    amount,
    description,
    account,
    tags,
  } = extractVariablesFromRequest();

  let category = event.Records[0].Sns.MessageAttributes.category.Value;
  let dateMeantFor;
  let futureDatesToCreate = new Date(futureDateToCreate);

  function calculateCategory(compareString, sk) {
    if (helper.isNotEmpty(categoryMap[compareString])) {
      console.log(
        'The category for the transaction %j ',
        sk,
        ' is ',
        categoryMap[compareString],
      );
      category = categoryMap[compareString];
    }
  }

  function calculateDateMeanFor(compareString, sk) {
    if (helper.isNotEmpty(datesMap[compareString])) {
      console.log(
        'The date for the transaction %j ',
        sk,
        ' is ',
        datesMap[compareString],
      );
      dateMeantFor = datesMap[compareString];
    }
  }

  function createTransactionPutRequest(sk) {
    addItemArray.push({
      PutRequest: {
        Item: {
          pk: walletId,
          sk,
          recurrence,
          amount,
          description,
          category,
          account,
          tags,
          date_meant_for: dateMeantFor,
          creation_date: futureDatesToCreate.toISOString(),
          updated_date: new Date().toISOString(),
        },
      },
    });
  }

  while (futureDatesToCreate < today) {
    const sk = `Transaction#${futureDatesToCreate.toISOString()}`;

    const compareString = sk.substring(12, 19);
    calculateDateMeanFor(compareString, sk);
    calculateCategory(compareString, sk);
    createTransactionPutRequest(sk);

    // Update recurrence
    switch (recurrence) {
      case 'MONTHLY':
        futureDatesToCreate.setMonth(futureDatesToCreate.getMonth() + 1);
        break;
      case 'WEEKLY':
        futureDatesToCreate.setDate(futureDatesToCreate.getDate() + 7);
        break;
      case 'BI-MONTHLY':
        futureDatesToCreate.setDate(futureDatesToCreate.getDate() + 15);
        break;
      default:
        futureDatesToCreate = new Date();
        break;
    }
  }
}

Transaction.prototype.constructTransactions = constructTransactions;
// Export object
module.exports = new Transaction();
