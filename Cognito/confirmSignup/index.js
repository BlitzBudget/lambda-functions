const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

var sns = new AWS.SNS();

exports.handler = async (event) => {
    let response = {};
    let params = {
      ClientId: 'l7nmpavlqp3jcfjbr237prqae', /* required */
      ConfirmationCode: event['body-json'].confirmationCode, /* required */
      Username: event['body-json'].username, /* required */
    };
    
    await confirmSignUp(params).then(function(result) {}, function(err) {
       throw new Error("Unable to confirm signup from cognito  " + err);
    });
    
    let loginParams = {
      AuthFlow:  'USER_PASSWORD_AUTH',
      ClientId: 'l7nmpavlqp3jcfjbr237prqae', /* required */
      AuthParameters: {
          USERNAME: event['body-json'].username,
          PASSWORD: event['body-json'].password
      }
    };
    
    await initiateAuth(loginParams).then(function(result) {
       response = result;
    }, function(err) {
       throw new Error("Unable to login from cognito  " + err);
    });
    
    await getUser(response).then(function(result) {
       response.Username = result.Username;
       response.UserAttributes = result.UserAttributes;
       console.log("logged in the user " + JSON.stringify(result.Username));
    }, function(err) {
       throw new Error("Unable to signin from cognito  " + err);
    });
    
    /*
    * Do not create wallet
    */
    if(event['body-json'].doNotCreateWallet) {
        return response;
    }
    
    /*
    * Get locale to currency
    */
    let currenyChosen = localeToCurrency[event.params.header['CloudFront-Viewer-Country']];
    /*
    * If chosen currency is empty then revert to Dollars
    */
    currenyChosen = isEmpty(currenyChosen) ? '$' : currenyChosen;
    console.log("Fetching the country header from cloudfront ", currenyChosen);
    await addWalletThroughSNS(response.UserAttributes, currenyChosen).then(function(result) {}, function(err) {
      throw new Error("Unable to add new wallet" + err);
    });
    
    return response;
};

function addWalletThroughSNS(userAttributes, currency) {
    let financialPortfolioId = '';
    for(let i = 0, len = userAttributes.length; i < len; i++) {
      let attribute = userAttributes[i];
      
      if(isEqual(attribute.Name, 'custom:financialPortfolioId')) {
        financialPortfolioId = attribute.Value;
        break;
      }
    }

    let params = {
        Message: financialPortfolioId,
        MessageAttributes: {
            "currency": {
                "DataType": "String",
                "StringValue": currency
            }
        },
        TopicArn: 'arn:aws:sns:eu-west-1:064559090307:addWallet'
    };

    return new Promise((resolve, reject) => {
      sns.publish(params,  function(err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                resolve( "Reset account to SNS published");
            }
        });
    });
}

function confirmSignUp(params) {
    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.confirmSignUp(params, function(err, data) {  
          if (err) {
              console.log(err, err.stack); // an error occurred
              reject(err);
          }
          else {
              console.log(data);           // successful response
              resolve(data);
          }
        });
    });
}

function initiateAuth(params) {
    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.initiateAuth(params, function(err, data) {
          if (err) {
              console.log(err, err.stack); // an error occurred
              reject(err);
          }
          else {
              console.log(data);           // successful response
              resolve(data);
          }
        });
    });
}

function getUser(response) {
    let params = {
      AccessToken: response.AuthenticationResult.AccessToken /* required */
    };

    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.getUser(params, function(err, data) {
          if (err) {
              console.log(err, err.stack); // an error occurred
              reject(err);
          }
          else {
              console.log(data);           // successful response
              resolve(data);
          }
        });
    });
}

function isEqual(obj1,obj2){
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
      return true;
  }
  return false;
}

function isEmpty(obj) {
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

let localeToCurrency = {};
localeToCurrency['AI'] = 'East Caribbean Dollar';
localeToCurrency['AM'] = 'Armenian Dram';
localeToCurrency['AO'] = 'Angolan Kwanza';
localeToCurrency['AR'] = 'Argentine Peso';
localeToCurrency['AT'] = 'Euro';
localeToCurrency['AU'] = 'Australian Dollar';
localeToCurrency['AW'] = 'Aruban Florin';
localeToCurrency['AX'] = 'Euro';
localeToCurrency['BA'] = 'Convertible Mark';
localeToCurrency['BE'] = 'Euro';
localeToCurrency['BG'] = 'Bulgarian Lev';
localeToCurrency['BI'] = 'Burundi Franc';
localeToCurrency['BM'] = 'Bermudian Dollar';
localeToCurrency['BN'] = 'Brunei Dollar';
localeToCurrency['BO'] = 'Boliviano';
localeToCurrency['BR'] = 'Brazilian Real';
localeToCurrency['CC'] = 'Australian Dollar';
localeToCurrency['CF'] = 'CFA Franc BEAC';
localeToCurrency['CH'] = 'Swiss Franc';
localeToCurrency['CL'] = 'Chilean Peso';
localeToCurrency['CN'] = 'Renminbi (Yuan)';
localeToCurrency['CU'] = 'Cuban Peso';
localeToCurrency['CX'] = 'Australian Dollar';
localeToCurrency['DM'] = 'East Caribbean Dollar';
localeToCurrency['EC'] = 'US Dollar';
localeToCurrency['EE'] = 'Euro';
localeToCurrency['ES'] = 'Euro';
localeToCurrency['EH'] = 'Moroccan Dirham';
localeToCurrency['ET'] = 'Belarusian Ruble';
localeToCurrency['FI'] = 'Euro';
localeToCurrency['FJ'] = 'Fiji Dollar';
localeToCurrency['FM'] = 'US Dollar';
localeToCurrency['FO'] = 'Danish Kroner';
localeToCurrency['GB'] = 'Pound Sterling';
localeToCurrency['GD'] = 'East Caribbean Dollar';
localeToCurrency['GE'] = 'Lari';
localeToCurrency['GH'] = 'Cedi';
localeToCurrency['GI'] = 'Gibraltar Pound';
localeToCurrency['GP'] = 'Euro';
localeToCurrency['GQ'] = 'CFA Franc BEAC';
localeToCurrency['GT'] = 'Quetzal';
localeToCurrency['HN'] = 'Lempira';
localeToCurrency['HR'] = 'Croatian Kuna';
localeToCurrency['HT'] = 'Haitian Gourde';
localeToCurrency['ID'] = 'Rupiah';
localeToCurrency['IN'] = 'Indian Rupee';
localeToCurrency['IO'] = 'US Dollar';
localeToCurrency['IQ'] = 'Iraqi Dinar';
localeToCurrency['IT'] = 'Euro';
localeToCurrency['JO'] = 'Jordanian Dinar';
localeToCurrency['JP'] = 'Yen';
localeToCurrency['KG'] = 'Som';
localeToCurrency['KR'] = 'Won';
localeToCurrency['LI'] = 'Swiss Franc';
localeToCurrency['LK'] = 'Sri Lanka Rupee';
localeToCurrency['LT'] = 'Euro';
localeToCurrency['LV'] = 'Euro';
localeToCurrency['LY'] = 'Lybian Dinar';
localeToCurrency['MC'] = 'Euro';
localeToCurrency['ME'] = 'Euro';
localeToCurrency['MF'] = 'Euro';
localeToCurrency['MG'] = 'Malagasy Franc';
localeToCurrency['MN'] = 'Mongolia Tughrik';
localeToCurrency['MO'] = 'Macanese Pataca';
localeToCurrency['MT'] = 'Euro';
localeToCurrency['MX'] = 'Mexican Peso';
localeToCurrency['NE'] = 'West African CFA Franc';
localeToCurrency['NF'] = 'Australian Dollar';
localeToCurrency['NG'] = 'Nigerian Naira';
localeToCurrency['NI'] = 'Canadian Dollar';
localeToCurrency['NP'] = 'Nepalese Rupee';
localeToCurrency['PE'] = 'Peruvian (Nuevo) Sol';
localeToCurrency['PK'] = 'Pakistan Rupee';
localeToCurrency['PM'] = 'Euro';
localeToCurrency['PS'] = 'Egyptian Pound';
localeToCurrency['PT'] = 'Euro';
localeToCurrency['PY'] = 'Paraguayan Guarani';
localeToCurrency['RO'] = 'Leu';
localeToCurrency['RS'] = 'Serbian Dinar';
localeToCurrency['SC'] = 'Seychelles Rupee';
localeToCurrency['SD'] = 'South Sudanese pound';
localeToCurrency['SE'] = 'Swedish Krona';
localeToCurrency['SJ'] = 'Euro';
localeToCurrency['SK'] = 'Euro';
localeToCurrency['SL'] = 'Leone';
localeToCurrency['SN'] = 'West African CFA Franc';
localeToCurrency['SO'] = 'Somali Shilling';
localeToCurrency['SX'] = 'Antillean Guilder';
localeToCurrency['TG'] = 'West African CFA Franc';
localeToCurrency['TH'] = 'Thai Baht';
localeToCurrency['TL'] = 'US Dollar';
localeToCurrency['TM'] = 'Manat';
localeToCurrency['UA'] = 'Ukrainian Hryvnia';
localeToCurrency['US'] = 'US Dollar';
localeToCurrency['UZ'] = "Uzbekistan Sum";
localeToCurrency['VA'] = "Euro";
localeToCurrency['VC'] = "East Caribbean Dollar";
localeToCurrency['VI'] = "US Dollar";
localeToCurrency['VN'] = "Vietnamese Dong";
localeToCurrency['VU'] = "Vanuatu Vatu";
localeToCurrency['WS'] = 'Tala';
localeToCurrency['YE'] = 'Yemeni Rial';
localeToCurrency['ZA'] = 'Rand';
