const UpdateHelper = () => {};

const AWS = require('aws-sdk');
const parameters = require('../utils/parameters');
const helper = require('../utils/helper');

// Load the AWS SDK for Node.js
// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient();

function updatingItem(event) {
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
      TableName: 'blitzbudget',
      Key: {
        pk: event['body-json'].userId,
        sk: event['body-json'].walletId,
      },
      UpdateExpression: updateExp,
      ExpressionAttributeNames: expAttrNames,
      ExpressionAttributeValues: expAttrVal,
    };
  }

  const params = createParameters(event);

  console.log('Updating an item...');
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        resolve({
          success: data,
        });
      }
    });
  });
}

UpdateHelper.prototype.updatingItem = updatingItem;
// Export object
module.exports = new UpdateHelper();
