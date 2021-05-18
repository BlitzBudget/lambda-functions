const updateWallet = require('../../../utils/update-wallet-helper');
const mockRequest = require('../../fixtures/request/processBlitzBudgetTable.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('update Wallet item', () => {
  mockRequest.Records[0].dynamodb.NewImage.account_balance = {
    N: 20,
  };
  mockRequest.Records[0].dynamodb.OldImage.account_balance = {
    N: 20,
  };
  mockRequest.Records[0].dynamodb.OldImage.primary_wallet = {
    S: 'Wallet#123',
  };
  mockRequest.Records[0].dynamodb.NewImage.primary_wallet = {
    S: 'Wallet#123',
  };
  mockRequest.Records[0].dynamodb.NewImage.account_type = {
    S: 'ASSET',
  };
  mockRequest.Records[0].dynamodb.OldImage.account_type = {
    S: 'ASSET',
  };
  mockRequest.Records[1].dynamodb.NewImage.account_balance = {
    N: 20,
  };
  mockRequest.Records[1].dynamodb.NewImage.primary_wallet = {
    S: 'Wallet#123',
  };
  mockRequest.Records[1].dynamodb.NewImage.account_type = {
    S: 'ASSET',
  };
  mockRequest.Records[2].dynamodb.OldImage.account_balance = {
    N: 30,
  };
  mockRequest.Records[2].dynamodb.OldImage.primary_wallet = {
    S: 'Wallet#',
  };
  mockRequest.Records[2].dynamodb.OldImage.account_type = {
    S: 'ASSET',
  };
  const events = [];
  test('MODIFY Wallet: Success', async () => {
    await updateWallet
      .updateWalletBalance(mockRequest.Records[0], events, documentClient);
    expect(events.length).toBe(0);
  });

  test('INSERT Wallet: Success', async () => {
    await updateWallet
      .updateWalletBalance(mockRequest.Records[1], events, documentClient);
    expect(events.length).toBe(1);
  });

  test('REMOVE Wallet: Success', async () => {
    await updateWallet
      .updateWalletBalance(mockRequest.Records[2], events, documentClient);
    expect(events.length).toBe(2);
  });
});

describe('update Wallet item : DEBT', () => {
  mockRequest.Records[0].dynamodb.NewImage.account_balance = {
    N: 20,
  };
  mockRequest.Records[0].dynamodb.OldImage.account_balance = {
    N: 20,
  };
  mockRequest.Records[0].dynamodb.OldImage.primary_wallet = {
    S: 'Wallet#123',
  };
  mockRequest.Records[0].dynamodb.NewImage.primary_wallet = {
    S: 'Wallet#123',
  };
  mockRequest.Records[0].dynamodb.NewImage.account_type = {
    S: 'DEBT',
  };
  mockRequest.Records[0].dynamodb.OldImage.account_type = {
    S: 'DEBT',
  };
  mockRequest.Records[1].dynamodb.NewImage.account_balance = {
    N: 20,
  };
  mockRequest.Records[1].dynamodb.NewImage.primary_wallet = {
    S: 'Wallet#123',
  };
  mockRequest.Records[1].dynamodb.NewImage.account_type = {
    S: 'DEBT',
  };
  mockRequest.Records[2].dynamodb.OldImage.account_balance = {
    N: 30,
  };
  mockRequest.Records[2].dynamodb.OldImage.primary_wallet = {
    S: 'Wallet#',
  };
  mockRequest.Records[2].dynamodb.OldImage.account_type = {
    S: 'DEBT',
  };
  const events = [];
  test('MODIFY DEBT Wallet: Success', async () => {
    await updateWallet
      .updateWalletBalance(mockRequest.Records[0], events, documentClient);
    expect(events.length).toBe(0);
  });

  test('INSERT DEBT Wallet: Success', async () => {
    await updateWallet
      .updateWalletBalance(mockRequest.Records[1], events, documentClient);
    expect(events.length).toBe(1);
  });

  test('REMOVE DEBT Wallet: Success', async () => {
    await updateWallet
      .updateWalletBalance(mockRequest.Records[2], events, documentClient);
    expect(events.length).toBe(2);
  });
});
