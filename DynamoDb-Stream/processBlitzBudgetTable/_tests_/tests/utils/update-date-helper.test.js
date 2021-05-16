const updateDate = require('../../../utils/update-date-helper');
const mockRequest = require('../../fixtures/request/processBlitzBudgetTable.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Update Date item', () => {
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
  const events = [];
  test('MODIFY Date: Success', async () => {
    await updateDate
      .updateDateTotal(mockRequest.Records[0], events, documentClient);
    expect(events.length).toBe(0);
  });

  test('INSERT Date: Success', async () => {
    await updateDate
      .updateDateTotal(mockRequest.Records[1], events, documentClient);
    expect(events.length).toBe(0);
  });

  test('REMOVE Date: Success', async () => {
    await updateDate
      .updateDateTotal(mockRequest.Records[2], events, documentClient);
    expect(events.length).toBe(1);
  });

  test('MODIFY with different balance Date: Success', async () => {
    mockRequest.Records[0].dynamodb.OldImage.category_total = {
      N: 30,
    };
    await updateDate
      .updateDateTotal(mockRequest.Records[0], events, documentClient);
    expect(events.length).toBe(2);
  });
});
