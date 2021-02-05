var wallet = function () { };

wallet.prototype.addNewWallet = (userAttributes, currency, DB) => {
    let userId = '';
    for(let i = 0, len = userAttributes.length; i < len; i++) {
      let attribute = userAttributes[i];
      
      if(isEqual(attribute.Name, 'custom:financialPortfolioId')) {
        userId = attribute.Value;
        break;
      }
    }
    
    let today = new Date();
    let randomValue = "Wallet#" + today.toISOString(); 
        
    var params = {
      TableName:'blitzbudget',
      Item:{
            "pk": userId,
            "sk": randomValue,
            "currency": currency,
            "wallet_balance": 0,
            "total_asset_balance": 0,
            "total_debt_balance": 0,
            "creation_date": new Date().toISOString(),
            "updated_date": new Date().toISOString()
      }
    };
    
    console.log("Adding a new item...");
    return new Promise((resolve, reject) => {
      DB.put(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            resolve({ "success" : data});
          }
      });
    });
    
}