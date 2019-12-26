exports.handler =  async function(event, context) {
    //console.log('event body - ' + event);
    const response = {
        message: "Success!! You invoked a delete account Lambda"
    };
    return response;
};
