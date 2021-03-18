const handle = require('../../index');
const mockSuccess = require('../fixtures/response/success');
const mockRequest = require('../fixtures/request/signup');
const mockRequestWithoutNames = require('../fixtures/request/signup_withoutnames');

jest.mock('../../cognito/signup', () => ({
  signup: (parameters) => Promise.resolve(mockSuccess(parameters)),
}));

describe('signupUser', () => {
  const event = mockRequest;
  test('With Data: Success', () => handle.handler(event).then((response) => {
    expect(response).not.toBeNull();
    expect(response.UserConfirmed).not.toBeNull();
    expect(response.UserConfirmed).toBe(false);
  }));
});

describe('signupUser without name', () => {
  const event = mockRequestWithoutNames;
  test('With Data: Success', () => handle.handler(event).then((response) => {
    expect(response).not.toBeNull();
    expect(response.UserConfirmed).not.toBeNull();
    expect(response.UserConfirmed).toBe(false);
  }));
});

describe('signupUser without name: ERROR', () => {
  jest.mock('../../cognito/signup', () => ({
    signup: (parameters) => Promise.reject(mockSuccess(parameters)),
  }));

  const event = mockRequestWithoutNames;
  test('With Data: Success', () => handle.handler(event).catch((response) => {
    expect(response).not.toBeNull();
    expect(response.message).not.toBeNull();
    expect(response.message).stringContaining('Unable to signin from cognito');
  }));
});
