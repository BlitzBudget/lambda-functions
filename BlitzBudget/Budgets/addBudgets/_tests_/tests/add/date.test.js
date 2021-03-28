const addDate = require('../../../add/date');
const mockRequest = require('../../fixtures/request/withDateAndCategory.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({ Attributes: {} }),
  })),
};

describe('Add Date item', () => {
  test('With Data: Success', async () => {
    const response = await addDate
      .createDateItem(mockRequest, 'dateId', documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Date).not.toBeUndefined();
  });
});
