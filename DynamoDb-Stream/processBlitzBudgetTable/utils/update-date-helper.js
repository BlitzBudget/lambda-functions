const updateDate = require('../update/date');
const util = require('./util');

module.exports.updateDateTotal = (record, events, documentClient) => {
  const pk = record.dynamodb.Keys.pk.S;
  let balance = 0;
  let date; let categoryType; let income = 0;
  let expense = 0;
  console.log('event is %j', record.eventName);
  if (util.isEqual(record.eventName, 'INSERT')) {
    return;
  } if (util.isEqual(record.eventName, 'REMOVE')) {
    balance = parseFloat(record.dynamodb.OldImage.category_total.N) * -1;
    categoryType = record.dynamodb.OldImage.category_type.S;
    date = record.dynamodb.OldImage.date_meant_for.S;
  } else if (util.isEqual(record.eventName, 'MODIFY')) {
    balance = parseFloat(record.dynamodb.NewImage.category_total.N)
      + (parseFloat(record.dynamodb.OldImage.category_total.N) * -1);
    categoryType = record.dynamodb.NewImage.category_type.S;
    date = record.dynamodb.NewImage.date_meant_for.S;
  }

  console.log('adding the difference %j', balance, 'to the date %j', date);

  // if balance is 0 then do nothing
  if (balance === 0) {
    return;
  }

  if (util.isEqual(categoryType, 'Expense')) {
    expense = balance;
  } else if (util.isEqual(categoryType, 'Income')) {
    income = balance;
  }

  events.push(updateDate.updateDateItem(pk, date, balance, income, expense, documentClient));
};
