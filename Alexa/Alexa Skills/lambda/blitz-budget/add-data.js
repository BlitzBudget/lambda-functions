const AddData = () => {};

// Setup ================================================================================

const utils = require('../helper/utils');
const blitzbudgetDB = require('../helper/blitz-budget');
const constants = require('../constants/constant.js');

AddData.prototype.addNewTransaction_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'addNewTransaction'
    );
  },
  async handle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let say = '';

    let slotStatus = '';
    let wallet;
    let shouldEndSession = true;

    // utils.getSlotValues returns .heardAs, .resolved, and
    // .isValidated for each slot, according to request slot status codes
    // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

    // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
    //   SLOT: goaltype
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
      console.log(
        'The default wallet is ',
        wallet.currency.S,
        ' Heard as ',
        slotValues.currency.heardAs,
      );
    }

    // utils.getSlotValues returns .heardAs, .resolved, and
    // .isValidated for each slot, according to request slot status codes
    // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

    // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
    //   SLOT: category
    if (utils.isEmpty(wallet)) {
      slotStatus += constants.EMPTY_WALLET;
      shouldEndSession = false;
    } else {
      console.log(
        'The number of transaction is ',
        slotValues.number,
        ' The category is ',
        slotValues.category,
      );
      if (utils.isEmpty(slotValues.number.heardAs)) {
        slotStatus = constants.EMPTY_AMOUNT;
      } else if (
        slotValues.categories.heardAs
          && slotValues.categories.heardAs !== ''
      ) {
        // utils.getSlotValues returns .heardAs, .resolved, and
        // .isValidated for each slot, according to request slot status codes
        // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or
        // traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: category
        const category = await blitzbudgetDB.getCategoryAlexa(
          wallet.sk.S,
          slotValues.categories.heardAs,
          slotValues.date.heardAs,
        );
        if (utils.isEmpty(category)) {
          slotStatus = constants.THE_MESSAGE
              + slotValues.categories.heardAs
              + constants.CATEGORY_EMPTY
              + slotValues.categories.heardAs;
          shouldEndSession = false;
        } else {
          // If the category type is expense then
          const categoryType = category.category_type.S;
          let transactionTotal = Number(slotValues.number.heardAs);
          switch (categoryType) {
            case 'Expense':
              transactionTotal *= -1;
              break;
            default:
              break;
          }
          slotStatus = await blitzbudgetDB.addTransactionAlexaAmount(
            wallet.sk.S,
            category.sk.S,
            transactionTotal.toString(),
            slotValues.date.heardAs,
            wallet.currency.S,
          );
          // Successfully Added the transaction then
          if (utils.includesStr(slotStatus, constants.SUCCESSFUL_TITLE)) {
            // Send a simple card to Alexa on Success
            responseBuilder.withSimpleCard(
              constants.CARD_SECURITY_TITLE,
              constants.ADDED_NEW_TRANSACTION_SIMPLE_CARD,
            );
          }
        }
      } else {
        slotStatus = constants.EMPTY_CATEGORY;
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

AddData.prototype.addNewBudget_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest' && request.intent.name === 'addNewBudget'
    );
  },
  async handle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let shouldEndSession = true;

    let say = '';
    let slotStatus = '';
    let wallet;

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

    let currentDate = new Date();
    currentDate = `${currentDate.getFullYear()
    }-${
      (`0${Number(currentDate.getMonth()) + 1}`).slice(-2)}`;
    // utils.getSlotValues returns .heardAs, .resolved, and
    // .isValidated for each slot, according to request slot status codes
    // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

    // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
    //   SLOT: category
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
      } else if (utils.isEqual(category.category_type.S, 'Income')) {
        slotStatus = constants.INCOME_CATEGORY_ERROR;
        shouldEndSession = false;
      } else {
        const budget = await blitzbudgetDB.getBudgetAlexaAmount(
          wallet.sk.S,
          category.sk.S,
          currentDate,
        );
        if (utils.isEmpty(budget)) {
          slotStatus += await blitzbudgetDB.addBudgetAlexaAmount(
            wallet.sk.S,
            category.sk.S,
            slotValues.amount.heardAs,
            currentDate,
            slotValues.category.heardAs,
          );
          // Successfully added a new budget then
          if (utils.includesStr(slotStatus, constants.SUCCESSFUL_TITLE)) {
            // Send a simple card to Alexa on Success
            responseBuilder.withSimpleCard(
              constants.CARD_SECURITY_TITLE,
              constants.ADDED_NEW_BUDGET_SIMPLE_CARD,
            );
          }
        } else {
          slotStatus
              += constants.THE_MESSAGE
              + slotValues.category.heardAs
              + constants.BUDGET_CREATED_ERROR;
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

AddData.prototype.addNewGoal_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest' && request.intent.name === 'addNewGoal'
    );
  },
  async handle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let shouldEndSession = true;
    let say = '';
    let slotStatus = '';
    let wallet;

    // utils.getSlotValues returns .heardAs, .resolved, and
    // .isValidated for each slot, according to request slot status codes
    // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

    // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
    //   SLOT: goaltype
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

    // utils.getSlotValues returns .heardAs, .resolved, and
    // .isValidated for each slot, according to request slot status codes
    // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

    // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
    //   SLOT: category
    if (utils.isEmpty(wallet)) {
      slotStatus += constants.EMPTY_WALLET;
      shouldEndSession = false;
    } else {
      const goalType = utils.isEmpty(slotValues.goaltype.id)
        ? slotValues.goaltype.heardAs
        : slotValues.goaltype.id;
      if (
        utils.isEmpty(slotValues.goaltype.heardAs)
        && utils.isEmpty(slotValues.goaltype.id)
      ) {
        slotStatus = constants.GOAL_TYPE_ERROR;
        shouldEndSession = false;
      } else {
        slotStatus = await blitzbudgetDB.addNewGoalFromAlexa(
          wallet.sk.S,
          slotValues.amount.heardAs,
          goalType,
          slotValues.monthlyContribution.heardAs,
          slotValues.targetDate.heardAs,
        );
        // Successfully added a new goal then
        if (utils.includesStr(slotStatus, constants.SUCCESSFUL_TITLE)) {
          // Send a simple card to Alexa on Success
          responseBuilder.withSimpleCard(
            constants.CARD_SECURITY_TITLE,
            constants.ADDED_NEW_GOAL_SIMPLE_CARD,
          );
        }
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

AddData.prototype.addNewWallet_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest' && request.intent.name === 'addNewWallet'
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
    // utils.getSlotValues returns .heardAs, .resolved, and .isValidated for each slot,
    // according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or
    // traditional simple request slot without resolutions

    // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
    //   SLOT: currency
    if (slotValues.currency.heardAs && slotValues.currency.heardAs !== '') {
      const matchedCurrency = blitzbudgetDB.checkIfWalletIsInvalid(slotValues);
      if (utils.isEmpty(matchedCurrency)) {
        slotStatus = constants.CURRENCY_NOTFOUND;
        shouldEndSession = false;
      } else {
        slotStatus = await blitzbudgetDB.addWalletFromAlexa(
          sessionAttributes.userId,
          matchedCurrency,
        );
        // Successfully change budget amount then
        if (utils.includesStr(slotStatus, constants.SUCCESSFUL_TITLE)) {
          // Send a simple card to Alexa on Success
          responseBuilder.withSimpleCard(
            constants.CARD_SECURITY_TITLE,
            constants.ADDED_NEW_WALLET_SIMPLE_CARD,
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

AddData.prototype.addCategoryByDate_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'addCategoryByDate'
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

    if (utils.isEmpty(slotValues.categoryType.heardAs)) {
      slotStatus = constants.EMPTY_CATEGORY_TYPE;
      shouldEndSession = false;
    } else if (utils.isEmpty(wallet)) {
      slotStatus += constants.EMPTY_WALLET;
      shouldEndSession = false;
    } else {
      // utils.getSlotValues returns .heardAs, .resolved, and
      // .isValidated for each slot, according to request slot status codes
      // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or
      // traditional simple request slot without resolutions

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
          currentDate,
        );
        if (utils.isEmpty(category)) {
          slotStatus = await blitzbudgetDB.addCategoryByDateFromAlexa(
            wallet.sk.S,
            slotValues.date.heardAs,
            slotValues.category.heardAs,
            slotValues.categoryType.id,
          );
          // Successfully change budget amount then
          if (utils.includesStr(slotStatus, constants.SUCCESSFUL_TITLE)) {
            // Send a simple card to Alexa on Success
            responseBuilder.withSimpleCard(
              constants.CARD_SECURITY_TITLE,
              constants.ADDED_NEW_CATEGORY_SIMPLE_CARD,
            );
          }
        } else {
          slotStatus
              += constants.CATEGORY_EXISTS + slotValues.category.heardAs;
          shouldEndSession = false;
        }
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
module.exports = new AddData();
