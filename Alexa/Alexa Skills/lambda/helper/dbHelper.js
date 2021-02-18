// Setup ================================================================================

const AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-west-1' });

const constants = require('../constants/constant.js');

const DBHelper = () => {};
let docClient; let patchDocClient; let
  addDocClient;

// Functions ================================================================================

/*
 * PATCH: Initialize Roles and Doc Clients
 */
async function patchInitializeRolesAndDocClient() {
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
  patchDocClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    accessKeyId: credentials.Credentials.AccessKeyId,
    secretAccessKey: credentials.Credentials.SecretAccessKey,
    sessionToken: credentials.Credentials.SessionToken,
  });
}

/*
 * Initialize Roles and Doc Clients
 */
async function initializeRolesAndDocClient() {
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
  docClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    accessKeyId: credentials.Credentials.AccessKeyId,
    secretAccessKey: credentials.Credentials.SecretAccessKey,
    sessionToken: credentials.Credentials.SessionToken,
  });
}

/*
 * ADD: Initialize Roles and Doc Clients
 */
async function addInitializeRolesAndDocClient() {
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
  addDocClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    accessKeyId: credentials.Credentials.AccessKeyId,
    secretAccessKey: credentials.Credentials.SecretAccessKey,
    sessionToken: credentials.Credentials.SessionToken,
  });
}

// Initialize Roles and Doc docClient
initializeRolesAndDocClient();

// Initialize Roles and Doc docClient
patchInitializeRolesAndDocClient();

// Initialize Roles and Doc docClient
addInitializeRolesAndDocClient();

DBHelper.prototype.getFromBlitzBudgetTable = (params) => new Promise((resolve, reject) => {
  docClient.query(params, (err, data) => {
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
      TableName: constants.TABLE_NAME,
      Key: {
        userId: userID,
        movieTitle: movie,
      },
      ConditionExpression: 'attribute_exists(movieTitle)',
    };
    docClient.delete(params, (err, data) => {
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
    patchDocClient.updateItem(params, (err, data) => {
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
    addDocClient.putItem(params, (err, data) => {
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
