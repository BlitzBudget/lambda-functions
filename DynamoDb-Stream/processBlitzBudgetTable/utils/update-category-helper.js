const updateCategory = require('../update/category');
const helper = require('./helper');

module.exports.updateCategoryTotal = (record, events, documentClient) => {
  const pk = record.dynamodb.Keys.pk.S;
  let balance = 0;
  let category;
  console.log('event is %j', record.eventName);
  if (util.isEqual(record.eventName, 'INSERT')) {
    balance = parseFloat(record.dynamodb.NewImage.amount.N);
    category = record.dynamodb.NewImage.category.S;
  } else if (util.isEqual(record.eventName, 'REMOVE')) {
    balance = parseFloat(record.dynamodb.OldImage.amount.N) * -1;
    category = record.dynamodb.OldImage.category.S;
  } else if (util.isEqual(record.eventName, 'MODIFY')) {
    // If the balance has changed
    balance = parseFloat(record.dynamodb.NewImage.amount.N)
      + (parseFloat(record.dynamodb.OldImage.amount.N) * -1);
    category = record.dynamodb.NewImage.category.S;
    // If the category has changed
    if (util.isNotEqual(category, record.dynamodb.OldImage.category.S)) {
      // The old balance is deducted from the old category
      balance = (parseFloat(record.dynamodb.OldImage.amount.N) * -1);
      category = record.dynamodb.OldImage.category.S;
      // Event is pushed to the array
      console.log('adding the difference %j', balance, 'to the category %j', category);
      events.push(updateCategory.updateCategoryItem(pk, category, balance, documentClient));
      // The new balance is added to the new category
      balance = parseFloat(record.dynamodb.NewImage.amount.N);
      category = record.dynamodb.NewImage.category.S;
    }
  }

  console.log('adding the difference %j', balance, 'to the category %j', category);

  // if balance is 0 then do nothing
  if (balance === 0) {
    return;
  }

  events.push(updateCategory.updateCategoryItem(pk, category, balance, documentClient));
};
