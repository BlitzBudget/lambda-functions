var helper = function () { };

helper.prototype.createParameter = (event) => {
    return {
        ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g',
        Username: event['body-json'].username,
    };
}

// Export object
module.exports = new helper();
