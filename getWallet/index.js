// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = async (event) => {
  
  let walletData = '';
  
    await getWalletItem(event.params.querystring.financialPortfolioId).then(function(result) {
       console.log("successfully fetched the new wallet ");
       walletData = result.success.Item.wallets.SS;
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