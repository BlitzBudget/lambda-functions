var AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-west-1"
});

var docClient = new AWS.DynamoDB.DocumentClient();

let today = new Date();
let transactionSK = 'Transaction#' + today.getFullYear() + '-' + ('0' + today.getMonth()).slice(-2);

var params = {
    TableName: "blitzbudget",
    ProjectionExpression: "#pk, #sk, amount, description, category, recurrence",
    FilterExpression: "begins_with(#pk, :starts_with) and begins_with(#sk, :sk_starts_with) and #r = :re",
    ExpressionAttributeNames: {
        "#pk": "pk",
        "#sk": "sk",
        "#r": "recurrence",
    },
    ExpressionAttributeValues: {
         ":starts_with": 'Wallet#',
         ":sk_starts_with": transactionSK,
         ":re": 'MONTHLY'
    }
};


exports.handler = async (event) => {
    return await copyRecurringTransactionsFromPreviousMonths();
};


// Delete all transactions from an API call to EC2 function
function copyRecurringTransactionsFromPreviousMonths() {
    console.log('Searching all transactions with sk %j', transactionSK, " with previous date as %k", today.toISOString());
    
    return new Promise((resolve, reject) => {
        console.log("Scanning Transactions table.");
        docClient.scan(params, onScan);
    });
}

function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");
        data.Items.forEach(function(transaction) {
           console.log(
                transaction.sk + ": ",
                transaction.pk, "- recurrence:", transaction.recurrence);
        });

        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}