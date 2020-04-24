// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});


exports.handler = async (event) => {
  
    let goalData = '';
    let financialPortfolioId = event['body-json'].financialPortfolioId;
    console.log("financial portfolio id to patch the goal " + JSON.stringify(financialPortfolioId));
    
    // GET ITEM
    await getGoalItem(financialPortfolioId).then(function(result) {
       goalData = fetchGoalItemFromResult(result, event);
    }, function(err) {
       throw new Error("Unexpected error occured while fetching the goal " + err);
    });
    
    if(isEmpty(goalData) || isEmpty(financialPortfolioId)) {
      console.log("goal data is empty while doing an update.");
      return goalData;
    }
    
    // DELETE ITEM
    await deleteGoalItem(goalData, financialPortfolioId).then(function(result) {
       
    }, function(err) {
       throw new Error("Unexpected error occured while deleting the goal " + err);
    });

    // ADD ITEM
    await putGoalItem(goalData, financialPortfolioId, event).then(function(result) {
    }, function(err) {
       throw new Error("Unexpected error occured while adding the goal " + err);
    });
    
    return goalData;
};

/*
* Fetch goal Item
*/
function fetchGoalItemFromResult(result, event) {
  let goalData = '';
  
  // Return empty object if no items are present
  if(isEmpty(result)) return goalData;
  
  try {
    let goalResult = result.Item;
    
    Object.keys ( goalResult.goals ). forEach (k => { 
     if(typeof goalResult.goals[k] == 'object'){
       Object.keys ( goalResult.goals[k] ). forEach (l => { 
         let stringSet = goalResult.goals[k][l];
         stringSet = JSON.parse(stringSet);
         
         if(stringSet.id == event['body-json'].goalId) {
              goalData = stringSet;
              console.log("successfully fetched the matching goal " +  stringSet.id);
         }
       });
      }
    });
  } catch(event) {
    console.log(event);
    throw new Error(" Unexpected error occured while retrieving your goal information");
  }
   
   return goalData;
}

// Get goal Item
function getGoalItem(financialPortfolioId) {
    var params = {
      TableName: 'goals',
      Key: {
        'financial_portfolio_id': parseInt(financialPortfolioId)
      },
      ProjectionExpression: 'goals'
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.get(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            resolve(data);
          }
        });
    });
}

function deleteGoalItem(goalData, financialPortfolioId) {
    
    let params = {
      TableName: "goals",
      Key: { 'financial_portfolio_id' : financialPortfolioId },
      UpdateExpression: "DELETE #goals :goal",
      ExpressionAttributeNames: { "#goals" : "goals" },
      ExpressionAttributeValues: { ":goal": docClient.createSet(JSON.stringify(goalData)) }
    };
    
    return new Promise((resolve, reject) => {
        docClient.update(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            resolve({ "success" : true});
          }
        });
    });
}

function putGoalItem(goalData, financialPortfolioId, event) {
  
  // Update the currency
   let goalCurrency = event['body-json'].currency;
   if(isNotEmpty(goalCurrency)) {
      goalData.currency = goalCurrency; 
   }
   // Update the goal name
   let goalName = event['body-json'].name;
   if(isNotEmpty(goalName)) {
      goalData.name = goalName; 
   }
   
   var params = {
      TableName: "goals",
      Key: { 'financial_portfolio_id' : event['body-json'].financialPortfolioId },
      UpdateExpression: "ADD #goals :goal",
      ExpressionAttributeNames: { "#goals" : "goals" },
      ExpressionAttributeValues: { ":goal": docClient.createSet([JSON.stringify(goalData)]) }
    };
    
    return new Promise((resolve, reject) => {
        docClient.update(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            resolve({ "success" : true});
          }
        });
    });
}


function  isEmpty(obj) {
  // Check if objext is a number or a boolean
  if(typeof(obj) == 'number' || typeof(obj) == 'boolean') return false; 
  
  // Check if obj is null or undefined
  if (obj == null || obj === undefined) return true;
  
  // Check if the length of the obj is defined
  if(typeof(obj.length) != 'undefined') return obj.length == 0;
   
  // check if obj is a custom obj
  for(let key in obj) {
        if(obj.hasOwnProperty(key))return false;
  }
      
  return true;
}

function  isNotEmpty(obj) {
	return !isEmpty(obj);
}