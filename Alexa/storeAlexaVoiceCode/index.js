const crypto = require('crypto');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({
    region: 'eu-west-1'
});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

const clientId = '18he7k81dv7k6fccf7giiuo84r';
const clientSecret = 'ar8dgqr8e2jma0ojrkq5cu13bntnb624132uboirg9v6m1h4ge5';

exports.handler = async (event) => {
    let response = {};
    let username = event['body-json'].username;
    let deleteVoiceCode = event['body-json'].deleteVoiceCode;

    // Authorization code
    if (isEmpty(username)) {
        throw new Error("Unable to save authorization code as the user name is empty ");
    }

    // Save Alexa Voice Code
    if (isEmpty(event['body-json'].voiceCode)) {
        throw new Error("Unable to save alexa voice code as it is empty ");
    }

    let signature = crypto.createHmac('SHA256', clientSecret)
        .update(username + clientId)
        .digest('base64')

    let params = {
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        ClientId: clientId,
        /* required */
        UserPoolId: 'eu-west-1_cjfC8qNiB',
        /* required */
        AuthParameters: {
            USERNAME: username,
            PASSWORD: event['body-json'].password,
            SECRET_HASH: signature
        }
    };

    await adminInitiateAuth(params).then(function (result) {
        console.log("The result of the initiate Auth is", result);
        response = result;
    }, function (err) {
        throw new Error("Unable to signin from cognito  " + err);
    });

    /*
     * Get User Attributes
     */
    await getUser(response).then(function (result) {
        response.Username = result.Username;
        response.UserAttributes = result.UserAttributes;
        console.log("logged in the user " + JSON.stringify(result.Username));
    }, function (err) {
        throw new Error("Unable to signin from cognito  " + err);
    });

    /*
     * Fetch user id from cognito attributes
     */
    let userId;
    for (let i = 0, len = response.UserAttributes.length; i < len; i++) {
        let userAttribute = response.UserAttributes[i];
        if (isEqual(userAttribute.Name, 'custom:financialPortfolioId')) {
            // User Id
            userId = userAttribute.Value;
        }
    }

    /*
     * User Id cannot be found
     */
    if (isEmpty(userId)) {
        throw new Error("Unable to find the user id when trying to retrieve user attributes from cognito");
    }

    /*
     * Add a new voice code
     */
    let today = new Date();
    // Check if the voice code is present
    let voiceCodePresent = false;
    let alexaId = "AlexaVoiceCode#" + today.toISOString();

    /*
     * Check if the new voice code is present
     */
    await getNewVoiceCode(userId).then(function (result) {
        if (result.Count > 0) {
            for (const alexaVoiceCode of result.Items) {
                console.log("successfully assigned the old voice code id ", alexaVoiceCode.sk);
                alexaId = alexaVoiceCode.sk;
                voiceCodePresent = true;
            }
        }
    }, function (err) {
        throw new Error("Unable to get a new voice code " + err);
    });

    if (deleteVoiceCode && voiceCodePresent) {
        /*
         * Delete the old voice code
         */
        await deleteOldVoiceCode(userId, alexaId).then(function (result) {
            console.log("successfully added the old voice code");
        }, function (err) {
            throw new Error("Unable to delete the old voice code " + err);
        });
    } else {
        /*
         * Add a new voice code
         */
        await addNewVoiceCode(event, userId, alexaId).then(function (result) {
            console.log("successfully added a new voice code");
        }, function (err) {
            throw new Error("Unable to add a new voice code " + err);
        });
    }


    return event;
};

/*
 * Delete Old Voice Code
 */
function deleteOldVoiceCode(pk, sk) {
    console.log('Delete old voice code for the primary key ' + pk);

    var params = {
        "TableName": 'blitzbudget',
        "Key": {
            "pk": pk,
            "sk": sk
        }
    };

    return new Promise((resolve, reject) => {
        docClient.delete(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                resolve({
                    "success": data
                });
            }
        });
    });
}

/*
 * Get New Voice Code
 */
function getNewVoiceCode(userId) {
    var params = {
        TableName: 'blitzbudget',
        KeyConditionExpression: "pk = :userId and begins_with(sk, :items)",
        ExpressionAttributeValues: {
            ":userId": userId,
            ":items": "AlexaVoiceCode#"
        },
        ProjectionExpression: "voice_code, sk, pk"
    };

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("data retrieved ", JSON.stringify(data.Items));
                resolve(data);
            }
        });
    });
}

/*
 * Get User
 */
function getUser(response) {
    let params = {
        AccessToken: response.AuthenticationResult.AccessToken /* required */
    };

    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.getUser(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                console.log(data); // successful response
                resolve(data);
            }
        });
    });
}

/*
 * Voice Code
 */
function addNewVoiceCode(event, userId, alexaId) {
    let today = new Date().toISOString();

    var params = {
        TableName: 'blitzbudget',
        Item: {
            "pk": userId,
            "sk": alexaId,
            "voice_code": event['body-json'].voiceCode,
            "failure_rate": 0,
            "creation_date": today,
            "updated_date": today
        }
    };

    console.log("Adding a new item...");
    return new Promise((resolve, reject) => {
        docClient.put(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                resolve({
                    "success": data
                });
                event['body-json'].alexaVoiceCodeId = alexaId;
            }
        });
    });
}

/*
 * Admin initiate authentication
 */
function adminInitiateAuth(params) {
    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.adminInitiateAuth(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                console.log(data); // successful response
                resolve(data);
            }
        });
    });
}

function isEmpty(obj) {
    // Check if objext is a number or a boolean
    if (typeof (obj) == 'number' || typeof (obj) == 'boolean') return false;

    // Check if obj is null or undefined
    if (obj == null || obj === undefined) return true;

    // Check if the length of the obj is defined
    if (typeof (obj.length) != 'undefined') return obj.length == 0;

    // check if obj is a custom obj
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) return false;
    }

    return true;
}

function isEqual(obj1, obj2) {
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true;
    }
    return false;
}
