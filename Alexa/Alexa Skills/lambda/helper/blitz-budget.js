const BlitzbudgetDB = () => {};

// Setup ================================================================================

const utils = require('./utils');
const dbHelper = require('./dbHelper');
const currencyInfo = require('../constants/currency');

// Constants ============================================================================

const ON = ' on ';
const YOU = 'You ';
const ALSO = ' also ';
const SPENT = 'spent ';
const EARNED = 'earned ';
const YOU_EARNED = 'You earned ';
const SUCCESS_SPENT = 'You spent ';
const SUCCESS_WALLET_TWO = ' wallet.';
const SUCCESS_WALLET_ONE = 'Successfully added a ';
const SUCCESS_TRANSACTION_TOTAL = 'You transaction total is ';
const SUCCESS_ADDED_GOAL = 'Successfully added a new goal for ';
const SUCCESS_BUDGET_ADD = 'Successfully added a new budget for ';
const NO_TRANSACTIONS = 'You do not have any recent transactions.';
const ADDED_NEW_CATEGORY = 'Successfully added a new category for ';
const ADDED_NEW_TRANSACTION = 'Successfully added a new transaction for ';
const BUDGET_AMOUNT_SUCCESS = 'Successfully updated the budget amount to ';
const SUCCESS_DEFAULT_ACCOUNT = 'Successfully updated the default account to ';
const SUCCESSFUL_DEFAULT_WALLET = 'Successfully updated the default wallet to ';
const ERROR_ADDING_CATEGORY = 'Error adding a new category. Please try again later!';
const ERROR_ADDING_GOAL = 'There was an error while adding a new goal! Please try again later.';
const ERROR_BUDGET_ADD = 'There was an error while adding a new budget! Please try again later.';
const DEFAULT_ACCOUNT_NOTPRESENT = 'You do not have a default account in assigned to your wallet!';
const ERROR_ADDING_WALLET = 'There was an error while adding a new wallet! Please try again later.';
const ERROR_EARNED = "We couldn't calculate your earnings at this moment. Please try again later!";
const WALLET_NOT_PRESENT = 'The requested wallet is not present.';
const ACCOUNT_NOT_PRESENT = 'The requested account is not present.';
const ERROR_BUDGET_AMOUNT = 'There was an error while updating the budget amount! Please try again later.';
const ERROR_EXPENDITURE = "We couldn't calculate your expenditure at this moment. Please try again later!";
const ERROR_ADDING_TRANSACTION = 'There was an error while adding a new transaction! Please try again later.';
const CHANGING_DEFAULT_WALLET = 'Oops! there was an error changing the default wallet. Please try again later!';
const ERROR_CHANGING_ACCOUNT = 'Oops! there was an error changing the default account. Please try again later!';
const ERROR_TRANSACTION_TOTAL = "We couldn't calculate your transaction total at this moment. Please try again later!";

// Helper Functions ============================================================================
/*
 * Handle Helper Functions
 */

async function getDefaultAccount(walletId) {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': {
        S: walletId,
      },
      ':items': {
        S: 'BankAccount#',
      },
    },
    ProjectionExpression:
      'bank_account_name, linked, bank_account_number, account_balance, sk, pk, selected_account, number_of_times_selected, account_type',
  };
  return dbHelper
    .getFromBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully retrieved the account information from the DynamoDB. Item count is ${
          data.length}`,
      );
      let defaultAccount = data[0];
      // If length is empty
      if (utils.isEmpty(data)) {
        return undefined;
      }
      for (let i = 0, len = data.length; i < len; i++) {
        const ba = data[i];
        if (ba.selected_account) {
          defaultAccount = ba;
        }
      }

      return defaultAccount;
    })
    .catch((err) => {
      console.log(
        'There were issues getting your account from Blitz Budget. Please try again.',
        err,
      );
    });
}

async function createDateData(walletId, skForDate) {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      pk: walletId,
      sk: skForDate,
    },
    UpdateExpression:
      'set income_total = :r, expense_total=:p, balance=:a, creation_date = :c, updated_date = :u',
    ExpressionAttributeValues: {
      ':r': 0,
      ':p': 0,
      ':a': 0,
      ':c': new Date().toISOString(),
      ':u': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  };

  return dbHelper
    .addToBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully created the date to the DynamoDB. Item count is ${
          data.length}`,
      );
      return data;
    })
    .catch((err) => {
      console.log(' There was an error creating the date object', err);
    });
}

async function getDateData(walletId, currentDate) {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': {
        S: walletId,
      },
      ':items': {
        S: `Date#${currentDate}`,
      },
    },
    ProjectionExpression: 'pk, sk',
  };
  return dbHelper
    .getFromBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully retrieved the date information from the DynamoDB. Item count is ${
          data.length}`,
      );
      return data;
    })
    .catch((err) => {
      console.log('There was an error fetching the date information ', err);
    });
}

async function patchAccount(walletId, accountId, selectedAccount) {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      pk: {
        S: walletId,
      },
      sk: {
        S: accountId,
      },
    },
    UpdateExpression: 'set #variable1 = :v1, #update = :u',
    ExpressionAttributeNames: {
      '#variable1': 'selected_account',
      '#update': 'updated_date',
    },
    ExpressionAttributeValues: {
      ':v1': {
        BOOL: selectedAccount,
      },
      ':u': {
        S: new Date().toISOString(),
      },
    },
    ReturnValues: 'UPDATED_NEW',
  };

  console.log(
    'Updating the account with a default alexa property ',
    JSON.stringify(params),
  );

  return dbHelper.patchFromBlitzBudgetTable(params);
}

async function patchWallet(userId, walletId, defaultAlexa) {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      pk: {
        S: userId,
      },
      sk: {
        S: walletId,
      },
    },
    UpdateExpression: 'set #variable1 = :v1, #update = :u',
    ExpressionAttributeNames: {
      '#variable1': 'default_alexa',
      '#update': 'updated_date',
    },
    ExpressionAttributeValues: {
      ':v1': {
        BOOL: defaultAlexa,
      },
      ':u': {
        S: new Date().toISOString(),
      },
    },
    ReturnValues: 'UPDATED_NEW',
  };

  console.log(
    'Updating the wallet with a default alexa property ',
    JSON.stringify(params),
  );

  return dbHelper.patchFromBlitzBudgetTable(params);
}

/*
 * Fetch all default wallets
 */
BlitzbudgetDB.prototype.getDefaultAlexaWallet = async (userId) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': {
        S: userId,
      },
      ':items': {
        S: 'Wallet#',
      },
    },
    ProjectionExpression:
      'currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance, default_alexa',
  };
  return dbHelper
    .getFromBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully retrieved the wallet information from the DynamoDB. Item count is ${
          data.length}`,
      );
      let wallet = data[0];
      // If length is empty
      if (utils.isNotEmpty(data)) {
        for (let i = 0, len = data.length; i < len; i++) {
          const item = data[i];
          if (
            utils.isNotEmpty(item.default_alexa)
            && item.default_alexa.BOOL
          ) {
            wallet = item;
          }
        }
      }
      return wallet;
    })
    .catch((err) => {
      console.log('There was an error fetching the default wallet ', err);
    });
};

/*
 * Fetch all default accounts
 */
BlitzbudgetDB.prototype.getDefaultAlexaAccount = async (walletId) => {
  const defaultAccount = await getDefaultAccount(walletId);
  return defaultAccount;
};

/*
 * Fetch all category
 */
BlitzbudgetDB.prototype.getCategoryAlexa = async (
  walletId,
  categoryName,
  date,
) => {
  console.log('The Category name is ', categoryName, ' and the date is ', date);
  let selectedDate;
  if (utils.isEmpty(date)) {
    const currentDate = new Date();
    selectedDate = `${currentDate.getFullYear()
    }-${
      (`0${Number(currentDate.getMonth()) + 1}`).slice(-2)}`;
    console.log(
      'The date is empty, assigning the current date ',
      selectedDate,
      ' for the wallet ',
      walletId,
    );
  } else {
    selectedDate = date.substring(0, 7);
  }

  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': {
        S: walletId,
      },
      ':items': {
        S: `Category#${selectedDate}`,
      },
    },
    ProjectionExpression:
      'pk, sk, category_name, category_total, category_type',
  };

  console.log('Fetching the category with DynamoDB params ', params);

  return dbHelper
    .getFromBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully retrieved the category information from the DynamoDB. Item count is ${
          data.length}`,
      );
      let category;
      // If length is not empty
      if (utils.isNotEmpty(data)) {
        for (let i = 0, len = data.length; i < len; i++) {
          const item = data[i];
          if (
            utils.isEqual(
              item.category_name.S.toUpperCase(),
              categoryName.toUpperCase(),
            )
          ) {
            category = item;
            console.log(
              'The category balance of ',
              categoryName,
              ' has the balance of ',
              category.category_total.N,
            );
          }
        }
      }
      return category;
    })
    .catch((err) => {
      console.log(
        'There was an error getting the category from DynamoDB ',
        err,
      );
    });
};

/*
 * Fetch all budget
 */
BlitzbudgetDB.prototype.getBudgetAlexaAmount = async (
  walletId,
  categoryId,
  selectedDate,
) => {
  console.log(
    ' The date chosen for getting the budget with wallet',
    walletId,
    ' is ',
    selectedDate,
  );

  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': {
        S: walletId,
      },
      ':items': {
        S: `Budget#${selectedDate}`,
      },
    },
    ProjectionExpression: 'category, planned, sk, pk',
  };

  console.log('Fetching the budgets with DynamoDB params ', params);

  return dbHelper
    .getFromBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully retrieved the budget information from the DynamoDB. Item count is ${
          data.length}`,
      );
      let budget;
      // If length is not empty
      if (utils.isNotEmpty(data)) {
        for (let i = 0, len = data.length; i < len; i++) {
          const item = data[i];
          if (utils.isEqual(item.category.S, categoryId)) {
            budget = item;
            console.log('The budget has a balance of ', budget.planned.N);
          }
        }
      }
      return budget;
    })
    .catch((err) => {
      console.log(
        'There was an error getting the budget amount from DynamoDB ',
        err,
      );
    });
};

BlitzbudgetDB.prototype.getTagAlexaBalance = async (walletId,
  tagName,
  selectedDate) => {
  console.log(
    ' The date chosen for getting the transaction with wallet',
    walletId,
    ' is ',
    selectedDate,
  );

  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': {
        S: walletId,
      },
      ':items': {
        S: `Transaction#${selectedDate}`,
      },
    },
    ProjectionExpression: 'amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags',
  };

  return dbHelper
    .getFromBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully retrieved the transaction information from the DynamoDB. Item count is ${data.length}`,
      );
      let tagBal = 0;
      // If length is not empty
      if (utils.isNotEmpty(data)) {
        for (let i = 0, len = data.length; i < len; i++) {
          const item = data[i];
          // If tag is not present then continue with the loop
          if (utils.isNotEmpty(item.tags)) {
            const tags = item.tags.L;
            for (let j = 0, leng = tags.length; j < leng; j++) {
              const tag = tags[j];
              if (utils.isEqual(tag.S.toUpperCase(), tagName.toUpperCase())) {
                tagBal += Number(item.amount.N);
                // Break the tags for loop
                break;
              }
            }
          }
        }
      }

      return tagBal;
    })
    .catch((err) => {
      console.log('There was an error fetching the tag balance ', err);
    });
};

BlitzbudgetDB.prototype.getWalletFromAlexa = async (userId) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': {
        S: userId,
      },
      ':items': {
        S: 'Wallet#',
      },
    },
    ProjectionExpression: 'currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance, default_alexa',
  };
  return dbHelper
    .getFromBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully retrieved the wallet information from the DynamoDB. Item count is ${data.length}`,
      );
      return data;
    })
    .catch((err) => {
      console.log('There was an error getting the wallet from DynamoDB ', err);
    });
};

BlitzbudgetDB.prototype.changeDefaultWalletAlexa = async (userId,
  data,
  currencyName) => {
  const events = [];
  let say;
  // If length is empty
  if (utils.isNotEmpty(data)) {
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      console.log('Default Alexa is ', item.default_alexa);
      if (utils.isNotEmpty(item.default_alexa)
        && item.default_alexa.BOOL) {
        events.push(patchWallet(userId, item.sk.S, false));
      }
    }

    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      if (utils.isEqual(item.currency.S.toUpperCase(), currencyName.toUpperCase())) {
        console.log(
          'Potential match of wallet found with currency, ',
          currencyName,
          ' having a wallet id as ',
          item.sk.S,
        );
        events.push(patchWallet(userId, item.sk.S, true));
      }
    }
  }

  /*
   * Is Empty Events
   */
  if (utils.isEmpty(events)) {
    say = WALLET_NOT_PRESENT;
  } else {
    /*
     * Patch Wallet
     */
    await Promise.all(events).then(
      () => {
        console.log('Successfully updated the wallet information');
        say = SUCCESSFUL_DEFAULT_WALLET + currencyName;
      },
      (err) => {
        say = CHANGING_DEFAULT_WALLET;
        throw new Error(
          `Unable error occured while fetching the Wallet ${err}`,
        );
      },
    );
  }

  return say;
};

BlitzbudgetDB.prototype.getAccountFromAlexa = async (walletId) => {
  console.log('The account information to retrieve from wallet is', walletId);
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': {
        S: walletId,
      },
      ':items': {
        S: 'BankAccount#',
      },
    },
    ProjectionExpression: 'bank_account_name, linked, bank_account_number, account_balance, sk, pk, selected_account, number_of_times_selected, account_type',
  };
  return dbHelper
    .getFromBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully retrieved the account information from the DynamoDB. Item count is ${data.length}`,
      );
      return data;
    })
    .catch((err) => {
      console.log('There was an error getting the account from DynamoDB ', err);
    });
};

BlitzbudgetDB.prototype.calculateWalletFromAlexa = (
  allWallets,
  slotValues,
) => {
  const data = allWallets;
  let wallet;
  let walletCurrency;

  if (slotValues.currency.ERstatus === 'ER_SUCCESS_MATCH') {
    if (slotValues.currency.resolved !== slotValues.currency.heardAs) {
      walletCurrency = slotValues.currency.resolved;
    } else {
      walletCurrency = slotValues.currency.heardAs;
    }
  }
  if (slotValues.currency.ERstatus === 'ER_SUCCESS_NO_MATCH') {
    console.log(
      `***** consider adding "${
        slotValues.currency.heardAs
      }" to the custom slot type used by slot category! `,
    );
  } else if (utils.isNotEmpty(data)) {
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      if (
        utils.isEqual(
          item.currency.S.toUpperCase(),
          walletCurrency.toUpperCase(),
        )
      ) {
        wallet = item;
      }
    }
  }

  console.log('The wallet information calculated is ', wallet);
  return wallet;
};

BlitzbudgetDB.prototype.changeBudgetAlexaAmount = async (walletId,
  budgetId,
  amount,
  currencyName) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      pk: {
        S: walletId,
      },
      sk: {
        S: budgetId,
      },
    },
    UpdateExpression: 'set #variable1 = :v1, #update = :u',
    ExpressionAttributeNames: {
      '#variable1': 'planned',
      '#update': 'updated_date',
    },
    ExpressionAttributeValues: {
      ':v1': {
        N: amount,
      },
      ':u': {
        S: new Date().toISOString(),
      },
    },
    ReturnValues: 'UPDATED_NEW',
  };

  console.log(
    'Updating the budget with a default alexa property ',
    JSON.stringify(params),
  );

  return dbHelper
    .patchFromBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully retrieved the budget information from the DynamoDB. Item count is ${data.length}`,
      );
      return `${BUDGET_AMOUNT_SUCCESS + amount} ${currencyName}`;
    })
    .catch((err) => {
      console.log('There was an error changing the budget from DynamoDB ', err);
      return ERROR_BUDGET_AMOUNT;
    });
};

BlitzbudgetDB.prototype.checkIfWalletIsInvalid = (slotValues) => {
  let walletCurrency; let
    matchedCurrency;
  if (slotValues.currency.ERstatus === 'ER_SUCCESS_MATCH') {
    if (slotValues.currency.resolved !== slotValues.currency.heardAs) {
      walletCurrency = slotValues.currency.resolved;
    } else {
      walletCurrency = slotValues.currency.heardAs;
    }
  }
  if (slotValues.currency.ERstatus === 'ER_SUCCESS_NO_MATCH') {
    console.log(
      `***** consider adding "${slotValues.currency.heardAs}" to the custom slot type used by slot category! `,
    );
  }

  for (let i = 0, len = currencyInfo.length; i < len; i++) {
    const defaultCurrency = currencyInfo[i];
    if (utils.isEqual(
      defaultCurrency.currency.toUpperCase(),
      walletCurrency.toUpperCase(),
    )) {
      matchedCurrency = defaultCurrency.currency;
    }
  }

  return matchedCurrency;
};

BlitzbudgetDB.prototype.addWalletFromAlexa = async (userId, currency) => {
  const today = new Date();
  const randomValue = `Wallet#${today.toISOString()}`;

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      pk: {
        S: userId,
      },
      sk: {
        S: randomValue,
      },
      currency: {
        S: currency,
      },
      wallet_balance: {
        N: '0',
      },
      total_asset_balance: {
        N: '0',
      },
      total_debt_balance: {
        N: '0',
      },
      creation_date: {
        S: new Date().toISOString(),
      },
      updated_date: {
        S: new Date().toISOString(),
      },
    },
  };

  console.log(
    'Adding a wallet with a default alexa property ',
    JSON.stringify(params),
  );

  return dbHelper
    .addToBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully added the wallet to the DynamoDB. Item count is ${data.length}`,
      );
      return SUCCESS_WALLET_ONE + currency + SUCCESS_WALLET_TWO;
    })
    .catch((err) => {
      console.log('There was an error adding a new wallet from DynamoDB ', err);
      return ERROR_ADDING_WALLET;
    });
};

BlitzbudgetDB.prototype.addBudgetAlexaAmount = async (
  walletId,
  categoryId,
  amount,
  currentDate,
  categoryName,
) => {
  let alexaAmount = amount;
  const today = new Date();
  let dateId;
  const randomValue = `Budget#${today.toISOString()}`;
  let dateObj = await getDateData(walletId, currentDate);

  // If Date is not empty
  if (utils.isNotEmpty(dateObj)) {
    dateId = dateObj[0].sk.S;
  } else {
    dateId = `Date#${today.toISOString()}`;
    dateObj = await createDateData(walletId, dateId);
  }

  // If Amount if empty
  if (utils.isEmpty(alexaAmount)) {
    alexaAmount = '0';
  }

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      pk: {
        S: walletId,
      },
      sk: {
        S: randomValue,
      },
      category: {
        S: categoryId,
      },
      planned: {
        N: alexaAmount,
      },
      auto_generated: {
        BOOL: false,
      },
      date_meant_for: {
        S: dateId,
      },
      creation_date: {
        S: new Date().toISOString(),
      },
      updated_date: {
        S: new Date().toISOString(),
      },
    },
  };

  console.log('The add budget has the params ', JSON.stringify(params));

  return dbHelper
    .addToBlitzBudgetTable(params)
    .then(() => {
      console.log('Successfully added the budget to the DynamoDB.');
      return SUCCESS_BUDGET_ADD + categoryName;
    })
    .catch((err) => {
      console.log('There was an error adding a new budget from DynamoDB ', err);
      return ERROR_BUDGET_ADD;
    });
};

BlitzbudgetDB.prototype.addNewGoalFromAlexa = async (
  walletId,
  amount,
  goalType,
  monthlyContribution,
  targetDate,
) => {
  let goalTargetDate = targetDate;
  let goalAmount = amount;
  const today = new Date();
  const randomValue = `Goal#${today.toISOString()}`;
  goalTargetDate = new Date(goalTargetDate);

  if (utils.isEmpty(goalAmount)) {
    goalAmount = '0';
  }

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      pk: {
        S: walletId,
      },
      sk: {
        S: randomValue,
      },
      goal_type: {
        S: goalType,
      },
      final_amount: {
        N: goalAmount,
      },
      preferable_target_date: {
        S: goalTargetDate.toISOString(),
      },
      actual_target_date: {
        S: goalTargetDate.toISOString(),
      },
      monthly_contribution: {
        S: monthlyContribution,
      },
      target_id: {
        S: walletId,
      },
      target_type: {
        S: 'Wallet',
      },
      creation_date: {
        S: new Date().toISOString(),
      },
      updated_date: {
        S: new Date().toISOString(),
      },
    },
  };

  console.log('A new goal has the params ', params);

  return dbHelper
    .addToBlitzBudgetTable(params)
    .then(() => {
      console.log('Successfully added the goal to the DynamoDB.');
      return SUCCESS_ADDED_GOAL + goalType;
    })
    .catch((err) => {
      console.log('There was an error adding a new goal from DynamoDB ', err);
      return ERROR_ADDING_GOAL;
    });
};

BlitzbudgetDB.prototype.addTransactionAlexaAmount = async (walletId,
  categoryId,
  amount,
  dateId,
  currencyName) => {
  let transactionDateId = dateId;
  const today = new Date();
  // Date used to get the budget
  if (utils.isNotEmpty(dateId)) {
    const chosenYear = dateId.slice(0, 4);
    today.setFullYear(chosenYear);

    // If month is present
    if (dateId.length > 4) {
      let chosenMonth = dateId.slice(5, 7);
      // Javascript month is 0 -11 while alexa is 0-12
      chosenMonth = Number(chosenMonth) - 1;
      today.setMonth(chosenMonth);
    }

    // If date is present then
    if (dateId.length > 7) {
      const chosenDay = dateId.slice(8, 10);
      today.setDate(chosenDay);
    }
  }
  const randomValue = `Transaction#${today.toISOString()}`;
  const currentDate = `${today.getFullYear()}-${(`0${Number(today.getMonth()) + 1}`).slice(-2)}`;
  let dateObj = await getDateData(walletId, currentDate);

  // If Date is not empty
  if (utils.isNotEmpty(dateObj)) {
    transactionDateId = dateObj[0].sk.S;
  } else {
    transactionDateId = `Date#${today.toISOString()}`;
    dateObj = await createDateData(walletId, dateId);
  }

  const defaultAccount = await getDefaultAccount(walletId);
  if (utils.isEmpty(defaultAccount)) {
    console.log('The default account is not present');
    return DEFAULT_ACCOUNT_NOTPRESENT;
  }

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      pk: {
        S: walletId,
      },
      sk: {
        S: randomValue,
      },
      amount: {
        N: amount,
      },
      category: {
        S: categoryId,
      },
      recurrence: {
        S: 'NEVER',
      },
      account: {
        S: defaultAccount.sk.S,
      },
      date_meant_for: {
        S: transactionDateId,
      },
      creation_date: {
        S: today.toISOString(),
      },
      updated_date: {
        S: today.toISOString(),
      },
    },
  };

  console.log('Adding a new item...');
  return dbHelper
    .addToBlitzBudgetTable(params)
    .then(() => {
      console.log('Successfully added the transaction to the DynamoDB.');
      return `${ADDED_NEW_TRANSACTION + amount} ${currencyName}`;
    })
    .catch((err) => {
      console.log(
        'There was an error adding a new transaction from DynamoDB ',
        err,
      );
      return ERROR_ADDING_TRANSACTION;
    });
};

BlitzbudgetDB.prototype.getEarningsByDateFromAlexa = async (
  walletId,
  dateId,
  walletCurrency,
) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': {
        S: walletId,
      },
      ':items': {
        S: `Transaction#${dateId}`,
      },
    },
    ProjectionExpression:
      'amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags',
  };
  console.log('The params to fetch the earnings are ', params);

  return dbHelper
    .getFromBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully retrieved the transaction information from the DynamoDB. Item count is ${
          data.length}`,
      );
      let transactionBalance = 0;
      // If length is not empty
      if (utils.isNotEmpty(data)) {
        for (let i = 0, len = data.length; i < len; i++) {
          const item = data[i];
          const transactionAmount = Number(item.amount.N);
          if (transactionAmount > 0) {
            transactionBalance += transactionAmount;
          }
        }
      }
      return `${YOU_EARNED + transactionBalance} ${walletCurrency}`;
    })
    .catch((err) => {
      console.log('There was an error fetching the earnings ', err);
      return ERROR_EARNED;
    });
};

BlitzbudgetDB.prototype.getExpenditureByDateFromAlexa = async (
  walletId,
  dateId,
  walletCurrency,
) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': {
        S: walletId,
      },
      ':items': {
        S: `Transaction#${dateId}`,
      },
    },
    ProjectionExpression:
      'amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags',
  };
  console.log('The params to fetch the expense is ', params);

  return dbHelper
    .getFromBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully retrieved the transaction information from the DynamoDB. Item count is ${
          data.length}`,
      );
      let transactionBalance = 0;
      // If length is not empty
      if (utils.isNotEmpty(data)) {
        for (let i = 0, len = data.length; i < len; i++) {
          const item = data[i];
          const transactionAmount = Number(item.amount.N);
          if (transactionAmount < 0) {
            transactionBalance += transactionAmount;
          }
        }
      }
      return `${SUCCESS_SPENT + transactionBalance} ${walletCurrency}`;
    })
    .catch((err) => {
      console.log('There was an error fetching your expenditure ', err);
      return ERROR_EXPENDITURE;
    });
};

BlitzbudgetDB.prototype.getTransactionTotalByDateFromAlexa = async (walletId,
  dateId,
  walletCurrency) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': {
        S: walletId,
      },
      ':items': {
        S: `Transaction#${dateId}`,
      },
    },
    ProjectionExpression: 'amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags',
  };

  console.log('The params to fetch the transaction total are ', params);

  return dbHelper
    .getFromBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully retrieved the transaction information from the DynamoDB. Item count is ${data.length}`,
      );
      let transactionBalance = 0;
      // If length is not empty
      if (utils.isNotEmpty(data)) {
        for (let i = 0, len = data.length; i < len; i++) {
          const item = data[i];
          const transactionAmount = Number(item.amount.N);
          transactionBalance += transactionAmount;
        }
      }
      return (
        `${SUCCESS_TRANSACTION_TOTAL + transactionBalance} ${walletCurrency}`
      );
    })
    .catch((err) => {
      console.log('There was an error fetching the tag balance ', err);
      return ERROR_TRANSACTION_TOTAL;
    });
};

BlitzbudgetDB.prototype.addCategoryByDateFromAlexa = async (
  walletId,
  currentDate,
  categoryName,
  categoryType,
) => {
  let addCategoryName = categoryName;
  const today = new Date();

  if (utils.isNotEmpty(currentDate)) {
    const chosenYear = currentDate.slice(0, 4);
    today.setFullYear(chosenYear);

    // If month is present
    if (currentDate.length > 4) {
      let chosenMonth = currentDate.slice(5, 7);
      // Javascript month is 0 -11 while alexa is 0-12
      chosenMonth = Number(chosenMonth) - 1;
      today.setMonth(chosenMonth);
    }

    // If date is present then
    if (currentDate.length > 7) {
      const chosenDay = currentDate.slice(8, 10);
      today.setDate(chosenDay);
    }
  }
  const randomValue = `Category#${today.toISOString()}`;

  if (utils.isNotEmpty(categoryName)) {
    if (categoryName.length > 1) {
      addCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    } else {
      addCategoryName = categoryName.charAt(0).toUpperCase();
    }
  }

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      pk: {
        S: walletId,
      },
      sk: {
        S: randomValue,
      },
      category_name: {
        S: addCategoryName,
      },
      category_total: {
        N: '0',
      },
      category_type: {
        S: categoryType,
      },
    },
  };

  console.log('Adding a new item with param... ', params);
  return dbHelper
    .addToBlitzBudgetTable(params)
    .then(() => {
      console.log('Successfully added the category to the DynamoDB.');
      return ADDED_NEW_CATEGORY + categoryName;
    })
    .catch((err) => {
      console.log(
        'There was an error adding a new category from DynamoDB ',
        err,
      );
      return ERROR_ADDING_CATEGORY;
    });
};

BlitzbudgetDB.prototype.getMatchingWalletAlexa = (
  allWallets,
  walletCurrency,
) => {
  const data = allWallets;
  let wallet;

  // If length is empty
  if (utils.isNotEmpty(data)) {
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      if (
        utils.isEqual(
          item.currency.S.toUpperCase(),
          walletCurrency.toUpperCase(),
        )
      ) {
        wallet = item;
      }
    }
  }

  return wallet;
};

BlitzbudgetDB.prototype.getRecentTransactions = async (
  walletId,
  dateId,
  walletCurrency,
) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': {
        S: walletId,
      },
      ':items': {
        S: `Transaction#${dateId}`,
      },
    },
    ProjectionExpression:
      'amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags',
    ScanIndexForward: false,
  };

  console.log('The params to fetch the transaction total are ', params);

  return dbHelper
    .getFromBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully retrieved the transaction information from the DynamoDB. Item count is ${
          data.length}`,
      );
      let slotStatus = NO_TRANSACTIONS;
      // If length is not empty
      if (utils.isNotEmpty(data)) {
        let recentTransactions = '';
        // Maximum of 3 transactions
        const length = data.length < 3 ? data.length : 3;
        for (let i = 0, len = length; i < len; i++) {
          const item = data[i];
          const transactionAmount = Number(item.amount.N);
          const description = utils.isEmpty(item.description)
            ? ''
            : item.description.S;
          const dateMeantFor = item.date_meant_for.S;

          if (utils.isNotEmpty(dateMeantFor)) {
            recentTransactions
              += `On the <say-as interpret-as="date" format="md">${
                dateMeantFor.slice(10, 15)
              }</say-as> <break time="0.20s"/>`;
          }

          recentTransactions += YOU;

          // Append also from the second transaction onwards
          if (i > 0) {
            recentTransactions += ALSO;
          }

          if (transactionAmount < 0) {
            recentTransactions += SPENT;
          } else {
            recentTransactions += EARNED;
          }

          recentTransactions
            += `${Math.abs(transactionAmount)} ${walletCurrency}`;

          // If plural
          if (Math.abs(transactionAmount) > 1) {
            recentTransactions += 's';
          }

          // Add description if present
          if (utils.isNotEmpty(description)) {
            recentTransactions += ON + description;
          }

          recentTransactions += '<break time="0.75s"/> ';
        }
        slotStatus = recentTransactions;
      }
      return slotStatus;
    })
    .catch((err) => {
      console.log('There was an error fetching the tag balance ', err);
      return NO_TRANSACTIONS;
    });
};

BlitzbudgetDB.prototype.changeDefaultAccountAlexa = async (
  allAccounts,
  accountName,
) => {
  const events = [];
  let say;
  const data = allAccounts;

  // If length is empty
  if (utils.isNotEmpty(data)) {
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      // Selected Account Boolean
      if (
        utils.isNotEmpty(item.selected_account)
        && item.selected_account.BOOL
      ) {
        console.log(
          'The default selected account to change to false is ',
          item.bank_account_name.S,
        );
        events.push(patchAccount(item.pk.S, item.sk.S, false));
      }
    }

    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      if (
        utils.isEqual(
          item.bank_account_name.S.toUpperCase(),
          accountName.toUpperCase(),
        )
      ) {
        events.push(patchAccount(item.pk.S, item.sk.S, true));
      }
    }
  }

  /*
   * Is Empty Events
   */
  if (utils.isEmpty(events) || events.length === 1) {
    say = ACCOUNT_NOT_PRESENT;
  } else {
    /*
     * Patch Wallet
     */
    await Promise.all(events).then(
      () => {
        console.log('Successfully updated the account information');
        say = SUCCESS_DEFAULT_ACCOUNT + accountName;
      },
      (err) => {
        console.log(`Unable error occured while fetching the account ${err}`);
        say = ERROR_CHANGING_ACCOUNT;
      },
    );
  }

  return say;
};

// Export object
module.exports = new BlitzbudgetDB();
