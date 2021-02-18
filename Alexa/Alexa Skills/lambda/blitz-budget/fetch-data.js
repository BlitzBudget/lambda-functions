const FetchData = () => {};

// Setup ================================================================================

const utils = require('../helper/utils');
const blitzbudgetDB = require('../helper/blitz-budget');
const constants = require('../constants/constant.js');

FetchData.prototype.getWalletBalance_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'getWalletBalance'
    );
  },
  async handle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    console.log('The User id retrieved is ', sessionAttributes.userId);

    let say = '';
    let slotStatus = '';
    let shouldEndSession = true;

    const slotValues = utils.getSlotValues(request.intent.slots);

    if (slotValues.wallet.heardAs && slotValues.wallet.heardAs !== '') {
      let walletCurrency;
      if (slotValues.wallet.ERstatus === 'ER_SUCCESS_MATCH') {
        if (slotValues.wallet.resolved !== slotValues.wallet.heardAs) {
          walletCurrency = slotValues.wallet.resolved;
        } else {
          walletCurrency = slotValues.wallet.heardAs;
        }
      }

      if (slotValues.wallet.ERstatus === 'ER_SUCCESS_NO_MATCH') {
        console.log(
          `***** consider adding "${
            slotValues.wallet.heardAs
          }" to the custom slot type used by slot wallet! `,
        );
        slotStatus += constants.ERR_MESSAGE;
        shouldEndSession = false;
      } else {
        console.log('The wallet currency to change is ', walletCurrency);
        const allWallets = await blitzbudgetDB.getWalletFromAlexa(
          sessionAttributes.userId,
        );
        const wallet = blitzbudgetDB.getMatchingWalletAlexa(
          allWallets,
          walletCurrency,
        );
        // Successfully Changed the default wallet then
        if (utils.isNotEmpty(wallet)) {
          slotStatus
            += `${constants.GET_WALLET_BALANCE
            + wallet.wallet_balance.N
            } ${
              walletCurrency}`;
          // Send a simple card to Alexa on Success
          responseBuilder.withSimpleCard(
            constants.CARD_SECURITY_TITLE,
            constants.CHANGED_DEFAULT_WALLET_SIMPLE_CARD,
          );
        } else {
          slotStatus = constants.WALLET_IS_NOT_PRESENT + walletCurrency;
        }
      }
    } else {
      const wallet = await blitzbudgetDB.getDefaultAlexaWallet(
        sessionAttributes.userId,
      );

      console.log('The wallets obtained are ', JSON.stringify(wallet));

      // Successfully Changed the default wallet then
      if (utils.isNotEmpty(wallet)) {
        slotStatus
          += `${constants.GET_WALLET_BALANCE
          + wallet.wallet_balance.N
          } ${
            wallet.currency.S}`;
        // Send a simple card to Alexa on Success
        responseBuilder.withSimpleCard(
          constants.CARD_SECURITY_TITLE,
          constants.CHANGED_DEFAULT_WALLET_SIMPLE_CARD,
        );
      } else {
        slotStatus = constants.WALLET_IS_NOT_PRESENT + wallet.currency.S;
      }
    }

    say += slotStatus;

    return responseBuilder
      .speak(say)
      .reprompt(`try again, ${say}`)
      .withShouldEndSession(shouldEndSession) // End session for security purposes
      .getResponse();
  },
};

FetchData.prototype.getRecentTransactions_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'getRecentTransactions'
    );
  },
  async handle(handlerInput) {
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    console.log('The User id retrieved is ', sessionAttributes.userId);
    const wallet = await blitzbudgetDB.getDefaultAlexaWallet(
      sessionAttributes.userId,
    );

    console.log('The wallets obtained are ', JSON.stringify(wallet));
    console.log(
      `Calculating recent transactions for the wallet ${wallet.sk.S}`,
    );
    let say = '';
    let slotStatus = '';
    const shouldEndSession = true;

    slotStatus = await blitzbudgetDB.getRecentTransactions(
      wallet.sk.S,
      '2020-09',
      wallet.currency.S,
    );

    say += slotStatus;

    return responseBuilder
      .speak(say)
      .reprompt(`try again, ${say}`)
      .withShouldEndSession(shouldEndSession) // End session for security purposes
      .getResponse();
  },
};

FetchData.prototype.getCategoryBalance_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'getCategoryBalance'
    );
  },
  async handle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    console.log('The User id retrieved is ', sessionAttributes.userId);
    const wallet = await blitzbudgetDB.getDefaultAlexaWallet(
      sessionAttributes.userId,
    );

    console.log('The wallets obtained are ', JSON.stringify(wallet));
    let say = '';

    let slotStatus = '';
    let shouldEndSession = true;

    const slotValues = utils.getSlotValues(request.intent.slots);
    // utils.getSlotValues returns .heardAs, .resolved, and
    // .isValidated for each slot, according to request slot status codes
    // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or
    // traditional simple request slot without resolutions

    // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
    //   SLOT: category
    if (slotValues.category.heardAs && slotValues.category.heardAs !== '') {
      const category = await blitzbudgetDB.getCategoryAlexa(
        wallet.sk.S,
        slotValues.category.heardAs,
        slotValues.date.heardAs,
      );
      if (utils.isEmpty(category)) {
        slotStatus
          += constants.THE_MESSAGE
          + slotValues.category.heardAs
          + constants.CATEGORY_EMPTY
          + slotValues.category.heardAs;
        shouldEndSession = false;
      } else {
        slotStatus
          += `${constants.YOUR_MESSAGE
          + slotValues.category.heardAs
          + constants.CATEGORY_BALANCE_ERROR_TWO
          + category.category_total.N
          } ${
            wallet.currency.S}`;
      }
    } else {
      slotStatus += constants.ERR_MESSAGE;
      shouldEndSession = false;
    }

    say += slotStatus;

    return responseBuilder
      .speak(say)
      .reprompt(`try again, ${say}`)
      .withShouldEndSession(shouldEndSession) // End session for security purposes
      .getResponse();
  },
};

FetchData.prototype.getBudgetAmount_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'getBudgetAmount'
    );
  },
  async handle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const wallet = await blitzbudgetDB.getDefaultAlexaWallet(
      sessionAttributes.userId,
    );

    let say = '';

    let slotStatus = '';

    let shouldEndSession = true;

    const slotValues = utils.getSlotValues(request.intent.slots);
    // utils.getSlotValues returns .heardAs, .resolved, and
    // .isValidated for each slot, according to request slot status codes
    // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

    // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));

    // Date
    let currentDate = new Date();
    // Date used to get the budget
    if (utils.isNotEmpty(slotValues.date.heardAs)) {
      let dateMentioned = slotValues.date.heardAs;
      console.log('The Date mentioned is ', dateMentioned);
      if (dateMentioned.length < 6) {
        // For example is 2019 then become 2019-09
        dateMentioned = `${dateMentioned}-${currentDate.getMonth() + 1}`;
      }
      currentDate = new Date(dateMentioned);
    }
    currentDate = `${currentDate.getFullYear()
    }-${
      (`0${Number(currentDate.getMonth()) + 1}`).slice(-2)}`;

    //   SLOT: category
    if (slotValues.category.heardAs && slotValues.category.heardAs !== '') {
      const category = await blitzbudgetDB.getCategoryAlexa(
        wallet.sk.S,
        slotValues.category.heardAs,
        currentDate,
      );
      if (utils.isEmpty(category)) {
        slotStatus
          += constants.THE_MESSAGE
          + slotValues.category.heardAs
          + constants.CATEGORY_EMPTY
          + slotValues.category.heardAs;
        shouldEndSession = false;
      } else {
        const budget = await blitzbudgetDB.getBudgetAlexaAmount(
          wallet.sk.S,
          category.sk.S,
          currentDate,
        );
        if (utils.isEmpty(budget)) {
          slotStatus
            += constants.THE_MESSAGE
            + slotValues.category.heardAs
            + constants.BUDGET_EMPTY_ERROR
            + slotValues.category.heardAs;
          shouldEndSession = false;
        } else {
          slotStatus
            += `${constants.YOUR_MESSAGE
            + slotValues.category.heardAs
            + constants.BUDGET_RETRIEVED
            + budget.planned.N
            } ${
              wallet.currency.S}`;
        }
      }
    } else {
      slotStatus += constants.ERR_MESSAGE;
      shouldEndSession = false;
    }

    say += slotStatus;

    return responseBuilder
      .speak(say)
      .reprompt(`try again, ${say}`)
      .withShouldEndSession(shouldEndSession) // End session for security purposes
      .getResponse();
  },
};

FetchData.prototype.getBudgetBalance_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'getBudgetBalance'
    );
  },
  async handle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const wallet = await blitzbudgetDB.getDefaultAlexaWallet(
      sessionAttributes.userId,
    );
    let shouldEndSession = true;

    let say = '';
    let slotStatus = '';

    const slotValues = utils.getSlotValues(request.intent.slots);
    // utils.getSlotValues returns .heardAs, .resolved, and
    // .isValidated for each slot, according to request slot status codes
    // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

    // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));

    // Date
    let currentDate = new Date();
    currentDate = `${currentDate.getFullYear()
    }-${
      (`0${Number(currentDate.getMonth()) + 1}`).slice(-2)}`;

    //   SLOT: category
    if (slotValues.category.heardAs && slotValues.category.heardAs !== '') {
      const category = await blitzbudgetDB.getCategoryAlexa(
        wallet.sk.S,
        slotValues.category.heardAs,
        currentDate,
      );
      if (utils.isEmpty(category)) {
        slotStatus
          += constants.THE_MESSAGE
          + slotValues.category.heardAs
          + constants.CATEGORY_EMPTY
          + slotValues.category.heardAs;
        shouldEndSession = false;
      } else {
        const budget = await blitzbudgetDB.getBudgetAlexaAmount(
          wallet.sk.S,
          category.sk.S,
          currentDate,
        );
        if (utils.isEmpty(budget)) {
          slotStatus
            += constants.THE_MESSAGE
            + slotValues.category.heardAs
            + constants.BUDGET_NOT_CREATED
            + category.category_name.S
            + constants.BUDGET_NOT_CREATED_TWO
            + category.category_name.S;
          shouldEndSession = false;
        } else {
          const budgetBalance = Number(budget.planned.N) + Number(category.category_total.N);
          slotStatus
            += `${constants.YOUR_MESSAGE
            + slotValues.category.heardAs
            + constants.BUDGET_BALANCE_ONE
            + budgetBalance
            } ${
              wallet.currency.S
            }${constants.BUDGET_BALANCE_TWO}`;
        }
      }
    } else {
      slotStatus += constants.ERR_MESSAGE;
      shouldEndSession = false;
    }

    say += slotStatus;

    return responseBuilder
      .speak(say)
      .reprompt(`try again, ${say}`)
      .withShouldEndSession(shouldEndSession) // End session for security purposes
      .getResponse();
  },
};

FetchData.prototype.getTagBalance_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'getTagBalance'
    );
  },
  async handle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const wallet = await blitzbudgetDB.getDefaultAlexaWallet(
      sessionAttributes.userId,
    );

    let say = '';
    let slotStatus = '';
    let shouldEndSession = true;

    const slotValues = utils.getSlotValues(request.intent.slots);
    // utils.getSlotValues returns .heardAs, .resolved, and
    // .isValidated for each slot, according to request slot status codes
    // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

    // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));

    // Date
    let currentDate = new Date();
    currentDate = `${currentDate.getFullYear()
    }-${
      (`0${Number(currentDate.getMonth()) + 1}`).slice(-2)}`;

    //   SLOT: tag
    if (slotValues.tag.heardAs && slotValues.tag.heardAs !== '') {
      const tagBalance = await blitzbudgetDB.getTagAlexaBalance(
        wallet.sk.S,
        slotValues.tag.heardAs,
        currentDate,
      );
      if (utils.isEmpty(tagBalance)) {
        slotStatus
          += constants.THE_MESSAGE + slotValues.tag.heardAs + constants.EMPTY_TAG;
        shouldEndSession = false;
      } else {
        slotStatus
          += `${constants.YOUR_MESSAGE
          + slotValues.tag.heardAs
          + constants.TAG_MESSAGE
          + tagBalance
          } ${
            wallet.currency.S}`;
      }
      console.log(
        'The',
        slotValues.tag.heardAs,
        ' tag has a balance of ',
        tagBalance,
      );
    } else {
      slotStatus += constants.ERR_MESSAGE;
      shouldEndSession = false;
    }

    say += slotStatus;

    return responseBuilder
      .speak(say)
      .reprompt(`try again, ${say}`)
      .withShouldEndSession(shouldEndSession) // End session for security purposes
      .getResponse();
  },
};

FetchData.prototype.getDefaultWallet_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'getDefaultWallet'
    );
  },
  async handle(handlerInput) {
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const wallet = await blitzbudgetDB.getDefaultAlexaWallet(
      sessionAttributes.userId,
    );

    const say = constants.DEFAULT_WALLET + wallet.currency.S;

    return responseBuilder
      .speak(say)
      .reprompt(`try again, ${say}`)
      .withShouldEndSession(true) // End session for security purposes
      .getResponse();
  },
};

FetchData.prototype.getDefaultAccount_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'getDefaultAccount'
    );
  },
  async handle(handlerInput) {
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const wallet = await blitzbudgetDB.getDefaultAlexaWallet(
      sessionAttributes.userId,
    );
    console.log('The wallets obtained are ', JSON.stringify(wallet));
    let say;
    let shouldEndSession = true;

    if (utils.isEmpty(wallet)) {
      say += constants.EMPTY_WALLET;
      shouldEndSession = false;
    } else {
      const defaultAccount = await blitzbudgetDB.getDefaultAlexaAccount(
        wallet.sk.S,
      );

      if (utils.isEmpty(defaultAccount)) {
        say = constants.EMPTY_ACCOUNT;
        shouldEndSession = false;
      } else {
        say = constants.DEFAULT_ACCOUNT_SUCCESS
          + defaultAccount.bank_account_name.S;
      }
    }

    return responseBuilder
      .speak(say)
      .reprompt(`try again, ${say}`)
      .withShouldEndSession(shouldEndSession) // End session for security purposes
      .getResponse();
  },
};

FetchData.prototype.getEarningsByDate_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'getEarningsByDate'
    );
  },
  async handle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const wallet = await blitzbudgetDB.getDefaultAlexaWallet(
      sessionAttributes.userId,
    );

    let say = '';
    let slotStatus = '';
    let shouldEndSession = true;

    if (utils.isEmpty(wallet)) {
      slotStatus += constants.EMPTY_WALLET;
      shouldEndSession = false;
    } else {
      const slotValues = utils.getSlotValues(request.intent.slots);
      // utils.getSlotValues returns .heardAs, .resolved, and
      // .isValidated for each slot, according to request slot status codes
      // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or
      // traditional simple request slot without resolutions

      // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));

      //   SLOT: date
      if (slotValues.date.heardAs && slotValues.date.heardAs !== '') {
        slotStatus = await blitzbudgetDB.getEarningsByDateFromAlexa(
          wallet.sk.S,
          slotValues.date.heardAs,
          wallet.currency.S,
        );
      } else {
        slotStatus += constants.ERR_MESSAGE;
        shouldEndSession = false;
      }
    }

    say += slotStatus;

    return responseBuilder
      .speak(say)
      .reprompt(`try again, ${say}`)
      .withShouldEndSession(shouldEndSession) // End session for security purposes
      .getResponse();
  },
};

FetchData.prototype.getExpenditureByDate_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'getExpenditureByDate'
    );
  },
  async handle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const wallet = await blitzbudgetDB.getDefaultAlexaWallet(
      sessionAttributes.userId,
    );

    let say = '';
    let slotStatus = '';
    let shouldEndSession = true;

    if (utils.isEmpty(wallet)) {
      slotStatus += constants.EMPTY_WALLET;
      shouldEndSession = false;
    } else {
      const slotValues = utils.getSlotValues(request.intent.slots);
      // utils.getSlotValues returns .heardAs, .resolved, and
      // .isValidated for each slot, according to request slot status codes
      // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or
      // traditional simple request slot without resolutions

      // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));

      //   SLOT: date
      if (slotValues.date.heardAs && slotValues.date.heardAs !== '') {
        slotStatus = await blitzbudgetDB.getExpenditureByDateFromAlexa(
          wallet.sk.S,
          slotValues.date.heardAs,
          wallet.currency.S,
        );
      } else {
        slotStatus += constants.ERR_MESSAGE;
        shouldEndSession = false;
      }
    }

    say += slotStatus;

    return responseBuilder
      .speak(say)
      .reprompt(`try again, ${say}`)
      .withShouldEndSession(shouldEndSession) // End session for security purposes
      .getResponse();
  },
};

FetchData.prototype.getTransactionTotalByDate_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'getTransactionTotalByDate'
    );
  },
  async handle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const wallet = await blitzbudgetDB.getDefaultAlexaWallet(
      sessionAttributes.userId,
    );

    let say = '';
    let slotStatus = '';
    let shouldEndSession = true;

    if (utils.isEmpty(wallet)) {
      slotStatus += constants.EMPTY_WALLET;
      shouldEndSession = false;
    } else {
      const slotValues = utils.getSlotValues(request.intent.slots);
      // utils.getSlotValues returns .heardAs, .resolved, and
      // .isValidated for each slot, according to request slot status codes
      // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or
      // traditional simple request slot without resolutions

      // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));

      //   SLOT: date
      if (slotValues.date.heardAs && slotValues.date.heardAs !== '') {
        slotStatus = await blitzbudgetDB.getTransactionTotalByDateFromAlexa(
          wallet.sk.S,
          slotValues.date.heardAs,
          wallet.currency.S,
        );
      } else {
        slotStatus += constants.ERR_MESSAGE;
        shouldEndSession = false;
      }
    }

    say += slotStatus;

    return responseBuilder
      .speak(say)
      .reprompt(`try again, ${say}`)
      .withShouldEndSession(shouldEndSession) // End session for security purposes
      .getResponse();
  },
};

// Export object
module.exports = new FetchData();
