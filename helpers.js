//function to lookup email of user
const emailExistsInDatabase = function(userObj, emailInput) {
  for (const user in userObj) {
    if (userObj[user].email === emailInput) {
      return user;
    }
  }
  return false;
};

//function to determine the URLs of the logged in user
const urlsForUser = function(id, urlList) {
  const yourURLs = {};
  for (const shortURL in urlList) {
    if (urlList[shortURL].userID === id) {
      yourURLs[shortURL] = { longURL: urlList[shortURL].longURL, userID: urlList[shortURL].userID };
    }
  }
  return yourURLs;
};

//function to generate a random tinyURL
const generateRandomString = function() {
  let newShortURL = '';
  let characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 6; i++) {
    newShortURL += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return newShortURL;
};

//export helper functions
module.exports = { 
  emailExistsInDatabase,
  urlsForUser,
  generateRandomString
}