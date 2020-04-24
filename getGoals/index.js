// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});


exports.handler = async (event) => {
  
  let goalData = [];
  
    await getGoalItem(event.params.querystring.financialPortfolioId).then(function(result) {
       goalData = fetchGoalItemFromResult(result);
    }, function(err) {
       throw new Error("Unexpected error occured while fetching the goal " + err);
    });

    return goalData;
};

function fetchGoalItemFromResult(result) {
  let goalData = [];
  
  // Return empty object if no items are present
  if(isEmpty(result)) return goalData;
  
  try {
    let goalResult = result.Item;
    
    Object.keys ( goalResult.goals ). forEach (k => { 
     if(typeof goalResult.goals[k] == 'object'){
       Object.keys ( goalResult.goals[k] ). forEach (l => { 
         let stringSet = goalResult.goals[k][l];
         stringSet = JSON.parse(stringSet);
         console.log(stringSet);
         goalData.push(stringSet);
         
       });
      }
    });
    console.log("successfully fetched the new goal ");
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