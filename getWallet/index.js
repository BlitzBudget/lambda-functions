// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = async (event) => {
  
  let walletData = '';
  
    await getWalletItem(event.params.querystring.financialPortfolioId).then(function(result) {
       console.log("successfully fetched the new wallet " + JSON.stringify(result));
       walletData = isEmpty(result.success) ? result.success : result.success.Item.wallets.SS;
    }, function(err) {
       throw new Error("Unable to fetch the wallet " + err);
    });

    return walletData;
};


function getWalletItem(financialPortfolioId) {
    var params = {
      TableName: 'wallet',
      Key: {
        'financial_portfolio_id': {N: financialPortfolioId}
      },
      ProjectionExpression: 'wallets'
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        ddb.getItem(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            resolve({ "success" : data});
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