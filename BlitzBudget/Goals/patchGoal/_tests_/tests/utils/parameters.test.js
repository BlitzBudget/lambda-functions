const parameters = require('../../../utils/parameters');

describe('parameters:', () => {
  test('With Data: Success', () => {
    expect(parameters).not.toBeUndefined();
    expect(parameters[0].prmName).not.toBeUndefined();
    expect(parameters[0].prmValue).toBe('goal_type');
    expect(parameters[1].prmValue).not.toBeUndefined();
    expect(parameters[1].prmValue).toBe('final_amount');
    expect(parameters[2].prmName).not.toBeUndefined();
    expect(parameters[2].prmValue).toBe('target_id');
    expect(parameters[3].prmName).not.toBeUndefined();
    expect(parameters[3].prmValue).toBe('target_type');
  });
});
