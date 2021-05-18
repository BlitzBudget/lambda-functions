// Setup ================================================================================

const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_LAMBDA_REGION });

const DBHelper = () => {};
let documentClient; let patchdocumentClient; let
  adddocumentClient;

// Functions ================================================================================

/*
 * PATCH: Initialize Roles and Doc Clients
 */
async function patchInitializeRolesAnddocumentClient() {
  // 1. Assume the AWS resource role using STS AssumeRole Action
  const STS = new AWS.STS({ apiVersion: '2011-06-15' });
  const credentials = await STS.assumeRole(
    {
      RoleArn: 'arn:aws:iam::064559090307:role/patchItemFromBlitzBudget',
      RoleSessionName: 'PatchItemRoleSession', // You can rename with any name
    },
    (err, res) => {
      if (err) {
        console.log('AssumeRole FAILED: ', err);
        throw new Error('Error while assuming role');
      }
      return res;
    },
  ).promise();

  // 2. Make a new DynamoDB instance with the assumed role credentials
  //    and scan the DynamoDB table
  patchdocumentClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    accessKeyId: credentials.Credentials.AccessKeyId,
    secretAccessKey: credentials.Credentials.SecretAccessKey,
    sessionToken: credentials.Credentials.SessionToken,
  });
}

/*
 * Initialize Roles and Doc Clients
 */
async function initializeRolesAnddocumentClient() {
  // 1. Assume the AWS resource role using STS AssumeRole Action
  const STS = new AWS.STS({ apiVersion: '2011-06-15' });
  const credentials = await STS.assumeRole(
    {
      RoleArn: 'arn:aws:iam::064559090307:role/queryItemFromBlitzbudget',
      RoleSessionName: 'QueryItemRoleSession', // You can rename with any name
    },
    (err, res) => {
      if (err) {
        console.log('AssumeRole FAILED: ', err);
        throw new Error('Error while assuming role');
      }
      return res;
    },
  ).promise();

  // 2. Make a new DynamoDB instance with the assumed role credentials
  //    and scan the DynamoDB table
  documentClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    accessKeyId: credentials.Credentials.AccessKeyId,
    secretAccessKey: credentials.Credentials.SecretAccessKey,
    sessionToken: credentials.Credentials.SessionToken,
  });
}

/*
 * ADD: Initialize Roles and Doc Clients
 */
async function addInitializeRolesAnddocumentClient() {
  // 1. Assume the AWS resource role using STS AssumeRole Action
  const STS = new AWS.STS({ apiVersion: '2011-06-15' });
  const credentials = await STS.assumeRole(
    {
      RoleArn: 'arn:aws:iam::064559090307:role/addToBlitzBudgetTable',
      RoleSessionName: 'AddItemRoleSession', // You can rename with any name
    },
    (err, res) => {
      if (err) {
        console.log('AssumeRole FAILED: ', err);
        throw new Error('Error while assuming role');
      }
      return res;
    },
  ).promise();

  // 2. Make a new DynamoDB instance with the assumed role credentials
  //    and scan the DynamoDB table
  adddocumentClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    accessKeyId: credentials.Credentials.AccessKeyId,
    secretAccessKey: credentials.Credentials.SecretAccessKey,
    sessionToken: credentials.Credentials.SessionToken,
  });
}

// Initialize Roles and Doc documentClient
initializeRolesAnddocumentClient();

// Initialize Roles and Doc documentClient
patchInitializeRolesAnddocumentClient();

// Initialize Roles and Doc documentClient
addInitializeRolesAnddocumentClient();

DBHelper.prototype.getFromBlitzBudgetTable = (params) => new Promise((resolve, reject) => {
  documentClient.query(params, (err, data) => {
    if (err) {
      console.error(
        'Unable to read item. Error JSON:',
        JSON.stringify(err, null, 2),
      );
      return reject(JSON.stringify(err, null, 2));
    }
    console.log('GetItem succeeded:', JSON.stringify(data, null, 2));
    return resolve(data.Items);
  });
});

DBHelper.prototype.removeFromBlitzBudgetTable = function removeFromBlitzBudgetTable(movie, userID) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        userId: userID,
        movieTitle: movie,
      },
      ConditionExpression: 'attribute_exists(movieTitle)',
    };
    documentClient.delete(params, (err, data) => {
      if (err) {
        console.error(
          'Unable to delete item. Error JSON:',
          JSON.stringify(err, null, 2),
        );
        return reject(JSON.stringify(err, null, 2));
      }
      console.log(JSON.stringify(err));
      console.log('DeleteItem succeeded:', JSON.stringify(data, null, 2));
      return resolve();
    });
  });
};

DBHelper.prototype.patchFromBlitzBudgetTable = (params) => {
  console.log('Updating an item...');
  return new Promise((resolve, reject) => {
    patchdocumentClient.updateItem(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('PatchItem succeeded:', JSON.stringify(data, null, 2));
        resolve({
          success: data,
        });
      }
    });
  });
};

DBHelper.prototype.addToBlitzBudgetTable = (params) => {
  console.log('Adding an item...');
  return new Promise((resolve, reject) => {
    adddocumentClient.putItem(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('PutItem succeeded:', JSON.stringify(data, null, 2));
        resolve({
          success: data,
        });
      }
    });
  });
};

module.exports = new DBHelper();
