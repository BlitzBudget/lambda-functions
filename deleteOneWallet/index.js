// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});


exports.handler = async (event) => {
  
  let walletData = [];
    let financialPortfolioId = event.params.querystring.financialPortfolioId;
    
    await getWalletItem(financialPortfolioId).then(function(result) {
       walletData = fetchWalletItemFromResult(result, event);
    }, function(err) {
       throw new Error("Unexpected error occured while fetching the wallet " + err);
    });
    
    await deleteWalletItem(walletData, financialPortfolioId).then(function(result) {
       
    }, function(err) {
       throw new Error("Unexpected error occured while fetching the wallet " + err);
    });

    return "success";
};

/*
* Fetch Wallet Item
*/
function fetchWalletItemFromResult(result, event) {
  let walletData = '';
  
  // Return empty object if no items are present
  if(isEmpty(result)) return walletData;
  
  try {
    let walletResult = result.Item;
    
    Object.keys ( walletResult.wallets ). forEach (k => { 
     if(typeof walletResult.wallets[k] == 'object'){
       Object.keys ( walletResult.wallets[k] ). forEach (l => { 
         let stringSet = walletResult.wallets[k][l];
         stringSet = JSON.parse(stringSet);
         
         if(stringSet.id == event.params.querystring.walletId) {
           walletData = stringSet
         }
         console.log(stringSet);
         
       });
      }
    });
    console.log("successfully fetched the new wallet ");
  } catch(event) {
    console.log(event);
    throw new Error(" Unexpected error occured while retrieving your wallet information");
  }
   
   return walletData;
}

// Get wallet Item
function getWalletItem(financialPortfolioId) {
    var params = {
      TableName: 'wallet',
      Key: {
        'financial_portfolio_id': parseInt(financialPortfolioId)
      },
      ProjectionExpression: 'wallets'
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

function deleteWalletItem(walletData, financialPortfolioId) {
          
    var params = {
      TableName: "wallet",
      Key: { 'financial_portfolio_id' : financialPortfolioId },
      UpdateExpression: "DELETE #wallets :wallet",
      ExpressionAttributeNames: { "#wallets" : "wallets" },
      ExpressionAttributeValues: { ":wallet": docClient.createSet(JSON.stringify(walletData)) }
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

