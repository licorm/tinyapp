const { assert } = require('chai');

const { emailExistsInDatabase } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('emailExistsInDatabase', function() {
  it('should return a user with valid email', function() {
    const user = emailExistsInDatabase(testUsers, "user@example.com")
    const expectedOutput = "userRandomID";
    assert.deepEqual(user, expectedOutput);
  });
  it('should return undefined with a non-valid email', function() {
    const user = emailExistsInDatabase(testUsers, "user123@example.com")
    const expectedOutput = undefined;
    assert.deepEqual(user, expectedOutput);
  });
});
