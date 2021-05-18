const addHelper = require('../../../utils/add-helper');
const mockRequest = require('../../fixtures/request/addTransactionsWithMatchingCategory.json');
const mockRequestWithoutDate = require('../../fixtures/request/withoutDate.json');
const mockRequestWithCategory = require('../../fixtures/request/withDateAndCategory.json');
const mockResponse = require('../../fixtures/response/addCategory.json');
const mockFetchResponse = require('../../fixtures/response/fetchCategory.json');
const mockResponseWithDate = require('../../fixtures/response/fetchDate.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('With Add Category Data', () => {
  documentClient.query = jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockFetchResponse),
  }));

  test('Success', async () => {
    const events = await addHelper
      .addANewCategoryIfNotPresent(mockRequest, [],
        documentClient);
    expect(events).not.toBeUndefined();
    expect(events.length).toBe(0);
    expect(documentClient.update).toHaveBeenCalledTimes(0);
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});

describe('With Exiting Category Information', () => {
  const documentClientWithCategory = {
    update: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce(mockRequestWithCategory),
    })),
    query: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce({}),
    })),
  };

  test('Success', async () => {
    const events = await addHelper
      .addANewCategoryIfNotPresent(mockRequestWithCategory, [],
        documentClientWithCategory);
    expect(events).not.toBeUndefined();
    expect(events.length).toBe(0);
    expect(documentClientWithCategory.update).toHaveBeenCalledTimes(0);
    expect(documentClientWithCategory.query).toHaveBeenCalledTimes(0);
  });
});

describe('With Non Exiting Category Information And Without Category ID', () => {
  const documentClientWithCategory = {
    update: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce(mockResponse),
    })),
    query: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce({}),
    })),
  };

  test('Success', async () => {
    const events = await addHelper
      .addANewCategoryIfNotPresent(mockRequest, [],
        documentClientWithCategory);
    expect(events).not.toBeUndefined();
    expect(events.length).toBe(1);
    expect(documentClientWithCategory.update).toHaveBeenCalledTimes(1);
    expect(documentClientWithCategory.query).toHaveBeenCalledTimes(1);
  });
});

describe('With Add Category Data', () => {
  documentClient.query = jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockFetchResponse),
  }));

  test('Success', async () => {
    const events = await addHelper
      .addANewCategoryIfNotPresent(mockRequest, [],
        documentClient);
    expect(events).not.toBeUndefined();
    expect(events.length).toBe(0);
    expect(documentClient.update).toHaveBeenCalledTimes(0);
  });
});

describe('With Add All Items Data', () => {
  documentClient.put = jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockFetchResponse),
  }));

  test('Success', async () => {
    const response = await addHelper
      .addAllItems([], mockRequest,
        documentClient);
    expect(response).not.toBeUndefined();
    expect(response.transactionId).not.toBeUndefined();
    expect(response.nextRecurrence).not.toBeUndefined();
    expect(documentClient.put).toHaveBeenCalledTimes(2);
  });
});

describe('addANewDateIfNotPresent', () => {
  const documentClientWithDate = {
    update: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce(mockRequestWithCategory),
    })),
    query: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce(mockResponseWithDate),
    })),
  };

  test('With Data: Success', async () => {
    const events = await addHelper.addANewDateIfNotPresent(mockRequest, [],
      documentClientWithDate);
    expect(events.length).toBe(0);
  });

  test('Without Date Id: Success', async () => {
    const events = await addHelper.addANewDateIfNotPresent(mockRequestWithoutDate, [],
      documentClientWithDate);
    expect(events.length).toBe(1);
    expect(documentClientWithDate.query).toHaveBeenCalledTimes(1);
    expect(documentClientWithDate.update).toHaveBeenCalledTimes(1);
  });
});
