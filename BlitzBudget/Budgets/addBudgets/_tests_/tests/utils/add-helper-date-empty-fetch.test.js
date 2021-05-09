const addHelper = require('../../../utils/add-helper');
const mockRequestWithoutDateId = require('../../fixtures/request/withoutDate.json');
const mockResponse = require('../../fixtures/response/fetch-date.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      update: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce({}),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));
test('Fetch Date : Matching Date', async () => {
  mockRequestWithoutDateId['body-json'].category = 'Salary';

  const response = await addHelper
    .creatDateIfNecessary(new Date('2021-03'), 'walletId');

  expect(response).not.toBeUndefined();
  expect(response.dateId).toMatch(/2021-03/);
  expect(response.events).not.toBeUndefined();
  expect(response.events.length).toBe(1);
});
