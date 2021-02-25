const PatchGoal = () => {};

const AWS = require('aws-sdk');
const parameters = require('../utils/parameters');
const helper = require('../utils/helper');
const constants = require('../constants/constant');

// Load the AWS SDK for Node.js
// Set the region
AWS.config.update({ region: constants.EU_WEST_ONE });

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient();

function updatingGoals(event) {
  function createParameters() {
    let updateExp = 'set';
    const expAttrVal = {};
    const expAttrNames = {};

    if (helper.isEmpty(event['body-json'])) {
      return undefined;
    }

    for (let i = 0, len = parameters.length; i < len; i++) {
      const prm = parameters[i];

      // If the parameter is not found then do not save
      if (helper.isNotEmpty(event['body-json'][prm.prmName])) {
        // Add a comma to update expression
        if (helper.includesStr(updateExp, '#variable')) {
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
    if (helper.isEmpty(expAttrVal)) {
      return undefined;
    }

    updateExp += ', #update = :u';
    expAttrVal[':u'] = new Date().toISOString();
    expAttrNames['#update'] = 'updated_date';

    return {
      TableName: constants.TABLE_NAME,
      Key: {
        pk: event['body-json'].walletId,
        sk: event['body-json'].goalId,
      },
      UpdateExpression: updateExp,
      ExpressionAttributeNames: expAttrNames,
      ExpressionAttributeValues: expAttrVal,
    };
  }

  const params = createParameters(event);

  if (helper.isEmpty(params)) {
    return undefined;
  }

  console.log('Updating an item...');
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        resolve({ success: data });
      }
    });
  });
}

PatchGoal.prototype.updatingGoals = updatingGoals;

// Export object
module.exports = new PatchGoal();
