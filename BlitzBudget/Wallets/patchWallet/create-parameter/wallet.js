const parameters = require('../utils/parameters');
const constants = require('../constants/constant');
const helper = require('../utils/helper');

module.exports.createParameters = (event) => {
  let updateExp = 'set';
  const expAttrVal = {};
  const expAttrNames = {};

  if (util.isEmpty(event['body-json'])) {
    return undefined;
  }

  for (let i = 0, len = parameters.length; i < len; i++) {
    const prm = parameters[i];

    // If the parameter is not found then do not save
    if (util.isNotEmpty(event['body-json'][prm.prmName])) {
      // Add a comma to update expression
      if (util.includesStr(updateExp, '#variable')) {
        updateExp += ',';
      }

      console.log(`param name - ${event['body-json'][prm.prmName]}`);

      updateExp += ` #variable${i} = :v${i}`;
      expAttrVal[`:v${i}`] = event['body-json'][prm.prmName];
      expAttrNames[`#variable${i}`] = prm.prmValue;
    }
  }

  console.log(
    ' update expression ',
    JSON.stringify(updateExp),
    ' expression attribute value ',
    JSON.stringify(expAttrVal),
    ' expression Attribute Names ',
    JSON.stringify(expAttrNames),
  );
  if (util.isEmpty(expAttrVal)) {
    return undefined;
  }

  updateExp += ', #update = :u';
  expAttrVal[':u'] = new Date().toISOString();
  expAttrNames['#update'] = 'updated_date';

  return {
    TableName: constants.TABLE_NAME,
    Key: {
      pk: event['body-json'].userId,
      sk: event['body-json'].walletId,
    },
    UpdateExpression: updateExp,
    ExpressionAttributeNames: expAttrNames,
    ExpressionAttributeValues: expAttrVal,
  };
};
