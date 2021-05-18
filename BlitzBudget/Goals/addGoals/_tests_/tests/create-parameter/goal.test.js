const addGoalParameter = require('../../../create-parameter/goal');
const mockRequest = require('../../fixtures/request/addGoals');

describe('addDateParameter: createParameter', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
  });

  mockRequest['body-json'].categoryType = 'random';
  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = addGoalParameter.createParameter('randomValue', event);
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.Item).not.toBeUndefined();
    expect(parameters.Item.actual_target_date).not.toBeUndefined();
    expect(parameters.Item.creation_date).not.toBeUndefined();
    expect(parameters.Item.final_amount).not.toBeUndefined();
    expect(parameters.Item.goal_type).not.toBeUndefined();
    expect(parameters.Item.monthly_contribution).not.toBeUndefined();
    expect(parameters.Item.pk).not.toBeUndefined();
    expect(parameters.Item.preferable_target_date).not.toBeUndefined();
    expect(parameters.Item.sk).not.toBeUndefined();
    expect(parameters.Item.target_id).not.toBeUndefined();
    expect(parameters.Item.target_type).not.toBeUndefined();
    expect(parameters.Item.updated_date).not.toBeUndefined();
  });
});
