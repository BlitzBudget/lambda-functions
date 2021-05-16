const updateHelper = require('../../../utils/update-helper');
const mockRequest = require('../../fixtures/request/processBlitzBudgetTable.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      update: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce({}),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('update Wallet item', () => {
  test('MODIFY, Insert, Remove Item: Success', async () => {
    const response = await updateHelper
      .updateRelevantItems(mockRequest);
    expect(response).toBeUndefined();
  });

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

  test('MODIFY, INSERT, REMOVE Wallet: Success', async () => {
    const response = await updateHelper
      .updateRelevantItems(mockRequest);
    expect(response).toBeUndefined();
  });

  mockRequest.Records[0].dynamodb.NewImage.category_total = {
    N: 20,
  };
  mockRequest.Records[0].dynamodb.OldImage.category_total = {
    N: 20,
  };
  mockRequest.Records[0].dynamodb.OldImage.category_type = {
    S: 'Income',
  };
  mockRequest.Records[0].dynamodb.NewImage.category_type = {
    S: 'Income',
  };
  mockRequest.Records[0].dynamodb.NewImage.date_meant_for = {
    S: 'Date#123',
  };
  mockRequest.Records[0].dynamodb.OldImage.date_meant_for = {
    S: 'Date#123',
  };

  mockRequest.Records[2].dynamodb.OldImage.category_total = {
    N: 30,
  };
  mockRequest.Records[2].dynamodb.OldImage.category_type = {
    S: 'Income',
  };
  mockRequest.Records[2].dynamodb.OldImage.date_meant_for = {
    S: 'Date#123',
  };

  test('MODIFY, INSERT, REMOVE Category: Success', async () => {
    const response = await updateHelper
      .updateRelevantItems(mockRequest);
    expect(response).toBeUndefined();
  });
});
