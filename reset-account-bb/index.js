exports.handler =  async function(event, context) {
   console.log('event body - ' + JSON.stringify(event));
    const response = {
            message: 'Hello from Lambda!'
    }
    return response;
}