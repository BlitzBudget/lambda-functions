var helper = function () { };

const userPoolId = 'eu-west-1_cjfC8qNiB';
let params = {
    UserPoolId: userPoolId, /* required */
    /*Limit: 'NUMBER_VALUE',*/
    /*PaginationToken: 'STRING_VALUE'*/
};

helper.prototype.createParameters = (event) => {
    params.Username = event.params.querystring.userName;
    return params;
}

// Export object
module.exports = new helper();