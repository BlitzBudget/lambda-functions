const util = require('./util');
const publish = require('../sns/publish');
const constants = require('../constants/constant');

module.exports.publishToSNS = (response, sns, events) => {
  for (let i = 0, len = response.Items.length; i < len; i++) {
    const { sk } = response.Items[i];
    // If wallet item  then push to SNS
    if (util.includesStr(sk, constants.WALLET_ID_PREFIX)) {
      events.push(publish.publishToResetAccountsSNS(sk, sns));
    }
  }
};
