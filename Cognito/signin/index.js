const helper = require('helper');
const fetchUser = require('fetch-user');
const fetchWallet = require('fetch-wallet');
const login = require('login');

exports.handler = async (event) => {
    let response = {};
    let params = {
      AuthFlow:  'USER_PASSWORD_AUTH',
      ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g', /* required */
      AuthParameters: {
          USERNAME: event['body-json'].username,
          PASSWORD: event['body-json'].password
      }
    };
    
    await login.initiateAuth(params).then(function(result) {
       response = result;
    }, function(err) {
       throw new Error("Unable to signin from cognito  " + err);
    });
    
    if(event['body-json'].checkPassword == true) {
        return response;
    }

    await fetchUser.getUser(response).then(function(result) {
       response.Username = result.Username;
       response.UserAttributes = result.UserAttributes;
       console.log("logged in the user " + JSON.stringify(result.Username));
    }, function(err) {
       throw new Error("Unable to signin from cognito  " + err);
    });
    
    let userIdParam = fetchUserId(response);
    await fetchWallet.getWallet(userIdParam).then(function(result) {
       response.Wallet = result;
       console.log("logged in the user " + JSON.stringify(result.walletId));
    }, function(err) {
       throw new Error("Unable to get the wallet at the moment  " + err);
    });
    
    return response;
};
