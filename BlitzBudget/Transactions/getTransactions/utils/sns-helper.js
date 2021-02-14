var snsHelper = function () {};

const helper = require('helper');

/*
 * Send to SNS events
 */
async function sendSNSToCreateNewTransactions(snsEvents) {
  if (helper.isNotEmpty(snsEvents)) {
    await Promise.all(snsEvents).then(
      function () {
        console.log(
          'Successfully sent the pending recurring transactions for creation'
        );
      },
      function (err) {
        throw new Error(
          'Unable to send the pending recurring transactions for creation' + err
        );
      }
    );
  }
}

snsHelper.prototype.sendSNSToCreateNewTransactions = sendSNSToCreateNewTransactions;
// Export object
module.exports = new snsHelper();
