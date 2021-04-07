function Helper() {}

const util = require('./util');

Helper.prototype.formulateDateFromRequest = (event) => {
  const today = new Date();
  today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
  today.setMonth(
    parseInt(event['body-json'].dateMeantFor.substring(10, 12), 10) - 1,
  );
  return today;
};

Helper.prototype.calculateCategory = (data, event) => {
  console.log('data retrieved - Category %j', data.Count);
  let obj;
  if (util.isNotEmpty(data.Items)) {
    data.Items.forEach((categoryObj) => {
      if (util.isEqual(categoryObj.category_type, event['body-json'].categoryType)
        && util.isEqual(categoryObj.category_name, event['body-json'].category)) {
        console.log('Found a match for the mentioned category %j', categoryObj.sk);
        obj = categoryObj;
      }
    });
  }

  if (util.isEmpty(obj)) {
    console.log('No matching categories found');
  }
  return obj;
};

// Export object
module.exports = new Helper();
