const addDateHelper = require('../../../utils/add-date-helper');
const mockRequest = require('../../fixtures/request/withDateAndCategory.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({ Attributes: {} }),
  })),
};

describe('Add Date item', () => {
  test('With Data: Success', () => {
    const response = addDateHelper
      .createANewDate(new Date(), mockRequest, documentClient);
    expect(response).not.toBeUndefined();
    expect(response.dateId).not.toBeUndefined();
    expect(response.events.length).toBe(1);
  });
});
