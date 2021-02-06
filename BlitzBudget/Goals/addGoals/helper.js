var helper = function () { };

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'eu-west-1'
});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

let handleAddNewGoal = async function(event) {
    await addNewGoals(event).then(function () {
        console.log("successfully saved the new goals");
    }, function (err) {
        throw new Error("Unable to add the goals " + err);
    });
}

function addNewGoals(event) {
    let today = new Date();
    let randomValue = "Goal#" + today.toISOString();

    var params = createParameter();

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
                event['body-json'].goalId = randomValue;
            }
        });
    });


    function createParameter() {
        return {
            TableName: 'blitzbudget',
            Item: {
                "pk": event['body-json'].walletId,
                "sk": randomValue,
                "goal_type": event['body-json'].goalType,
                "final_amount": event['body-json'].targetAmount,
                "preferable_target_date": event['body-json'].targetDate,
                "actual_target_date": event['body-json'].actualTargetDate,
                "monthly_contribution": event['body-json'].monthlyContribution,
                "target_id": event['body-json'].targetId,
                "target_type": event['body-json'].targetType,
                "creation_date": new Date().toISOString(),
                "updated_date": new Date().toISOString()
            }
        };
    }
}

helper.prototype.handleAddNewGoal = handleAddNewGoal;
// Export object
module.exports = new helper();