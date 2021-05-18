module.exports = {
  THE_MESSAGE: ' The ',
  YOUR_MESSAGE: ' Your ',
  HELLO_MESSAGE: 'Hello ',
  TABLE_NAME: process.env.TABLE_NAME,
  BUDGET_BALANCE_TWO: ' remaining',
  BUDGET_BALANCE_ONE: ' budget has ',
  TAG_MESSAGE: ' tag has a balance of ',
  BUDGET_RETRIEVED: ' budget amount is ',
  DEFAULT_WALLET: 'Your default wallet is ',
  GET_WALLET_BALANCE: 'Your wallet balance is ',
  DEFAULT_ACCOUNT_SUCCESS: 'Your default account is ',
  BUDGET_CREATED_ERROR: ' budget has already been created.',
  GOODBYE_MESSAGE: 'Good bye. It was nice talking to you. ',
  CATEGORY_BALANCE_ERROR_TWO: ' category has a balance of ',
  GOAL_TYPE_ERROR: "I didn't get the goal type. Please try again!",
  EMPTY_CATEGORY_TYPE: 'The category type cannot be empty. Please try again!',
  EMPTY_TAG:
    ' tag is not present in any of the transactions. Please try again!',
  BUDGET_NOT_CREATED_TWO:
    ' by saying <break time="0.20s"/> "Add a new budget for "',
  BUDGET_NOT_CREATED:
    ' budget has not been created. Consider creating a budget for ',
  EMPTY_CATEGORY:
    "I didn't get the category entered for the transaction. Please try again!",
  HELP_MESSAGE:
    "You can say: 'alexa, hello', 'alexa, tell me my info' or 'alexa, who am I'.",
  INCOME_CATEGORY_ERROR:
    'Sorry! it is not possible to create a budget for an income category. Please try again!',
  GREETING_MESSAGE:
    '. <amazon:emotion name="excited" intensity="low"> What can I do for you today?  </amazon:emotion>',
  BUDGET_EMPTY_ERROR:
    ' budget is not created. Consider creating a new budget by saying <break time="0.20s"/> "Create a new budget for "',
  CATEGORY_EMPTY:
    ' category has not been created. Consider creating a new category by saying <break time="0.20s"/> "Create a new category for "',
  NEED_TO_LINK_MESSAGE:
    'Before we can continue, you will need to link your account to the skill using the card that I have sent to the Alexa app.',
  ERR_MESSAGE:
    '<amazon:emotion name="disappointed" intensity="medium"> Sorry, I can\'t understand that request. Please try again! </amazon:emotion>',
  WALLET_IS_NOT_PRESENT:
    'The wallet that you mentioned is not present. Consider adding a wallet by saying <break time="0.20s"/> "Add a new wallet for" ',
  EMPTY_AMOUNT:
    '<amazon:emotion name="disappointed" intensity="medium"> I didn\'t get the amount entered for the transaction. Please try again! </amazon:emotion>',
  CURRENCY_NOTFOUND:
    '<amazon:emotion name="disappointed" intensity="medium"> I couldn\'t find the currency that you mentioned. Please try again! </amazon:emotion>',
  EMPTY_ACCOUNT:
    '<amazon:emotion name="disappointed" intensity="medium"> Sorry, There was an error while getting you default account. </amazon:emotion> Please try again!',
  CATEGORY_EXISTS:
    '<amazon:emotion name="disappointed" intensity="medium"> The selected category is already present for the mentioned dates. </amazon:emotion> Consider creating a new category by saying <break time="0.20s"/> "Create a new category for "',
  EMPTY_WALLET:
    '<amazon:emotion name="disappointed" intensity="medium"> The requested currency cannot be found. </amazon:emotion> Consider creating a wallet by saying <break time="0.20s"/> "Create a new wallet for" <break time="0.06s"/> followed by the currency name as you find it in the blitz budget application. ',
  SUCCESSFUL_TITLE: 'Successfully',
  CARD_SECURITY_TITLE: 'BlitzBudget Security Information',
  ADDED_NEW_TRANSACTION_SIMPLE_CARD:
    'A new transaction was added through Alexa.',
  CHANGED_DEFAULT_WALLET_SIMPLE_CARD:
    'The default wallet for Alexa has been changed.',
  CHANGED_DEFAULT_ACCOUNT_SIMPLE_CARD:
    'The default account for Alexa has been changed.',
  ADDED_NEW_CATEGORY_SIMPLE_CARD:
    'A new category has been added through Alexa.',
  ADDED_NEW_WALLET_SIMPLE_CARD: 'A new wallet has been added through Alexa.',
  CHANGED_BUDGET_AMOUNT_SIMPLE_CARD:
    "A budget's amount has been changed through Alexa.",
  ADDED_NEW_GOAL_SIMPLE_CARD: 'A new goal has been added through Alexa.',
  ADDED_NEW_BUDGET_SIMPLE_CARD: 'A new budget has been added through Alexa.',
};
