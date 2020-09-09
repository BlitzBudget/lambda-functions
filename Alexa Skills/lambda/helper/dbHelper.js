var AWS = require("aws-sdk");
AWS.config.update({region: "eu-west-1"});

var dbHelper = function () { };
var docClient;
var patchDocClient;

/*
* Initialize Roles and Doc Clients
*/
async function initializeRolesAndDocClient() {
    // 1. Assume the AWS resource role using STS AssumeRole Action
    const STS = new AWS.STS({ apiVersion: '2011-06-15' });
    const credentials = await STS.assumeRole({
        RoleArn: 'arn:aws:iam::064559090307:role/queryItemFromBlitzbudget',
        RoleSessionName: 'QueryItemRoleSession' // You can rename with any name
    }, (err, res) => {
        if (err) {
            console.log('AssumeRole FAILED: ', err);
            throw new Error('Error while assuming role');
        }
        return res;
    }).promise();   
    
    // 2. Make a new DynamoDB instance with the assumed role credentials
    //    and scan the DynamoDB table
    docClient = new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        accessKeyId: credentials.Credentials.AccessKeyId,
        secretAccessKey: credentials.Credentials.SecretAccessKey,
        sessionToken: credentials.Credentials.SessionToken
    });
}

// Initialize Roles and Doc docClient
initializeRolesAndDocClient();

/*
* PATCH: Initialize Roles and Doc Clients
*/
async function patchInitializeRolesAndDocClient() {
    // 1. Assume the AWS resource role using STS AssumeRole Action
    const STS = new AWS.STS({ apiVersion: '2011-06-15' });
    const credentials = await STS.assumeRole({
        RoleArn: 'arn:aws:iam::064559090307:role/patchItemFromBlitzBudget',
        RoleSessionName: 'PatchItemRoleSession' // You can rename with any name
    }, (err, res) => {
        if (err) {
            console.log('AssumeRole FAILED: ', err);
            throw new Error('Error while assuming role');
        }
        return res;
    }).promise();   
    
    // 2. Make a new DynamoDB instance with the assumed role credentials
    //    and scan the DynamoDB table
    patchDocClient = new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        accessKeyId: credentials.Credentials.AccessKeyId,
        secretAccessKey: credentials.Credentials.SecretAccessKey,
        sessionToken: credentials.Credentials.SessionToken
    });
}

// Initialize Roles and Doc docClient
patchInitializeRolesAndDocClient();

dbHelper.prototype.addToBlitzBudgetTable = (movie, userID) => {
    
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            Item: {
              'movieTitle' : movie,
              'userId': userID
            }
        };
        docClient.put(params, (err, data) => {
            if (err) {
                console.log("Unable to insert =>", JSON.stringify(err))
                return reject("Unable to insert");
            }
            console.log("Saved Data, ", JSON.stringify(data));
            resolve(data);
        });
    });
}

dbHelper.prototype.getFromBlitzBudgetTable = (params) => {
    return new Promise((resolve, reject) => {
        docClient.query(params, (err, data) => {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                return reject(JSON.stringify(err, null, 2))
            } 
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            resolve(data.Items)
            
        })
    });
}

dbHelper.prototype.removeFromBlitzBudgetTable = (movie, userID) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            Key: {
                "userId": userID,
                "movieTitle": movie
            },
            ConditionExpression: "attribute_exists(movieTitle)"
        }
        docClient.delete(params, function (err, data) {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
                return reject(JSON.stringify(err, null, 2))
            }
            console.log(JSON.stringify(err));
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
            resolve()
        })
    });
}

dbHelper.prototype.patchFromBlitzBudgetTable = (params) => {

    console.log("Updating an item...");
    return new Promise((resolve, reject) => {
        patchDocClient.updateItem(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("PatchItem succeeded:", JSON.stringify(data, null, 2));
                resolve({
                    "success": data
                });
            }
        });
    });
}

module.exports = new dbHelper();