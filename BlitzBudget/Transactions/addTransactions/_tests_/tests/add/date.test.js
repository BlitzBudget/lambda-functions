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
      .createDateData(mockRequest, 'dateId', documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Date).not.toBeUndefined();
    expect(documentClient.update).toHaveBeenCalledTimes(1);
  });
});
