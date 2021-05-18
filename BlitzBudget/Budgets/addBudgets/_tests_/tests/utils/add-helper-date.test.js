const addHelper = require('../../../utils/add-helper');
const mockRequest = require('../../fixtures/request/withDateAndCategory.json');
const mockResponse = require('../../fixtures/response/fetch-date.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      update: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('creatDateIfNecessary', () => {
  test('With Data: Success', async () => {
    const response = await addHelper.creatDateIfNecessary(
      mockRequest['body-json'].dateMeantFor, 'walletId',
    );

    expect(response).not.toBeUndefined();
    expect(response.dateId).toMatch(/2020-05/);
    expect(response.events).not.toBeUndefined();
    expect(response.events.length).toBe(0);
  });

  test('Fetch Date : Not Matching Date', async () => {
    const response = await addHelper
      .creatDateIfNecessary(new Date('2021-03'), 'walletId');

    expect(response).not.toBeUndefined();
    expect(response.dateId).toBe('Date#2021-04-27T20:22:18.263Z');
    expect(response.events).not.toBeUndefined();
    expect(response.events.length).toBe(0);
  });
});
