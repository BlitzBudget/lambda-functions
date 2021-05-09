const organizeGoal = require('../../../organize/goal');
const mockResponse = require('../../fixtures/response/fetch-goal.json');

describe('organizeGoal: createParameter', () => {
  test('With Data: Success', () => {
    organizeGoal.organize(mockResponse);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Items).not.toBeUndefined();
    expect(mockResponse.Items[0].goalId).not.toBeUndefined();
    expect(mockResponse.Items[0].walletId).not.toBeUndefined();
  });
});
