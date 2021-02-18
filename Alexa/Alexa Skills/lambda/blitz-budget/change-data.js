const ChangeData = () => {};

// Setup ================================================================================

const utils = require('../helper/utils');
const blitzbudgetDB = require('../helper/blitz-budget');
const constants = require('../constants/constant.js');

ChangeData.prototype.changeDefaultWallet_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'changeDefaultWallet'
    );
  },
  async handle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let say = '';
    let slotStatus = '';
    let shouldEndSession = true;

    const slotValues = utils.getSlotValues(request.intent.slots);
    // utils.getSlotValues returns .heardAs, .resolved, and
    // .isValidated for each slot, according to request slot status codes
    // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

    // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
    //   SLOT: wallet
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
        const changeWallet = await blitzbudgetDB.changeDefaultWalletAlexa(
          sessionAttributes.userId,
          allWallets,
          walletCurrency,
        );
        slotStatus += changeWallet;
        // Successfully Changed the default wallet then
        if (utils.includesStr(slotStatus, constants.SUCCESSFUL_TITLE)) {
          // Send a simple card to Alexa on Success
          responseBuilder.withSimpleCard(
            constants.CARD_SECURITY_TITLE,
            constants.CHANGED_DEFAULT_WALLET_SIMPLE_CARD,
          );
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

ChangeData.prototype.changeDefaultAccount_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'changeDefaultAccount'
    );
  },
  async handle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
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
    // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

    // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
    //   SLOT: account
    if (slotValues.account.heardAs && slotValues.account.heardAs !== '') {
      const allAccounts = await blitzbudgetDB.getAccountFromAlexa(wallet.sk.S);
      const changeAccount = await blitzbudgetDB.changeDefaultAccountAlexa(
        allAccounts,
        slotValues.account.heardAs,
      );
      slotStatus = changeAccount;
      // Successfully Changed the default wallet then
      if (utils.includesStr(slotStatus, constants.SUCCESSFUL_TITLE)) {
        // Send a simple card to Alexa on Success
        responseBuilder.withSimpleCard(
          constants.CARD_SECURITY_TITLE,
          constants.CHANGED_DEFAULT_ACCOUNT_SIMPLE_CARD,
        );
      }
    } else {
      slotStatus = constants.ERR_MESSAGE;
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

ChangeData.prototype.changeBudgetAmount_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'changeBudgetAmount'
    );
  },
  async handle(handlerInput) {
    let wallet;
    let shouldEndSession = true;
    const { request } = handlerInput.requestEnvelope;
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    console.log('The Budget amount is ', JSON.stringify(request.intent.slots));
    const slotValues = utils.getSlotValues(request.intent.slots);
    if (utils.isNotEmpty(slotValues.currency.heardAs)) {
      const allWallets = await blitzbudgetDB.getWalletFromAlexa(
        sessionAttributes.userId,
      );
      wallet = blitzbudgetDB.calculateWalletFromAlexa(allWallets, slotValues);
      console.log(
        'The calculate wallet is ',
        JSON.stringify(wallet),
        '. The currency name is ',
        slotValues.currency.heardAs,
      );
    } else {
      wallet = await blitzbudgetDB.getDefaultAlexaWallet(
        sessionAttributes.userId,
      );
      console.log('The default wallet is ', wallet.currency.S);
    }

    let say = '';
    let slotStatus = '';

    let currentDate = new Date();
    currentDate = `${currentDate.getFullYear()
    }-${
      (`0${Number(currentDate.getMonth()) + 1}`).slice(-2)}`;

    if (utils.isEmpty(wallet)) {
      slotStatus += constants.EMPTY_WALLET;
      shouldEndSession = false;
    } else if (slotValues.category.heardAs && slotValues.category.heardAs !== '') {
      // utils.getSlotValues returns .heardAs, .resolved, and
      // .isValidated for each slot, according to request slot status codes
      // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or
      // traditional simple request slot without resolutions

      // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
      //   SLOT: category
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
          slotStatus += await blitzbudgetDB.changeBudgetAlexaAmount(
            wallet.sk.S,
            budget.sk.S,
            slotValues.amt.heardAs,
            wallet.currency.S,
          );
          // Successfully change budget amount then
          if (utils.includesStr(slotStatus, constants.SUCCESSFUL_TITLE)) {
            // Send a simple card to Alexa on Success
            responseBuilder.withSimpleCard(
              constants.CARD_SECURITY_TITLE,
              constants.CHANGED_BUDGET_AMOUNT_SIMPLE_CARD,
            );
          }
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

// Export object
module.exports = new ChangeData();
