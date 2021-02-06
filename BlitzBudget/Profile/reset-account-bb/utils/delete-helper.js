var deleteHelper = function () { };

const userPoolId = 'eu-west-1_cjfC8qNiB';
let paramsDelete = {
    UserPoolId: userPoolId,
    /* required */
};

function handleDeleteAccount(event, cognitoIdServiceProvider) {
    let events = [];
    paramsDelete.Username = event['body-json'].userName;

    if (isDeleteAccount()) {
        events.push(globalSignoutFromAllDevices(event, cognitoIdServiceProvider));
        events.push(deleteCognitoAccount(paramsDelete, cognitoIdServiceProvider));
    }

    return events;

    function isDeleteAccount() {
        return event['body-json'].deleteAccount;
    }
}

deleteHelper.prototype.handleDeleteAccount = handleDeleteAccount;

// Export object
module.exports = new deleteHelper(); 