module.exports.TABLE_NAME = process.env.TABLE_NAME;
module.exports.WALLET_ID_PREFIX = 'Wallet#';
module.exports.PROPERTIES_TO_FETCH = 'currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance';
module.exports.KEY_CONDITION_EXPRESSION = 'pk = :userId and begins_with(sk, :items)';
module.exports.CLIENT_ID = process.env.CLIENT_ID;
module.exports.AUTH_FLOW = 'USER_PASSWORD_AUTH';
module.exports.AWS_LAMBDA_REGION = process.env.AWS_LAMBDA_REGION;
module.exports.FINANCIAL_PORTFOLIO_ID = 'custom:financialPortfolioId';
