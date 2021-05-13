const util = require('../utils/util');

module.exports.filter = (data, event) => {
  console.log('data retrieved - Category %j', data.Count);
  let obj;

  if (util.isNotEmpty(data.Items)) {
    data.Items.forEach((categoryObj) => {
      if (
        util.isEqual(
          categoryObj.category_type,
          event['body-json'].categoryType,
        )
          && util.isEqual(categoryObj.category_name, event['body-json'].category)
      ) {
        console.log(
          'Found a match for the mentioned category %j',
          categoryObj.sk,
        );
        obj = categoryObj;
      }
    });
  }

  if (util.isEmpty(obj)) {
    console.log('No matching categories found');
  }
  return obj;
};
