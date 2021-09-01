//setting up our express server
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//setting ejs as the view engine
app.set('view engine', 'ejs');

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

//users database
const users = { 
  "userID": {
    id: "userID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2ID": {
    id: "user2ID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

//function to lookup email of user
const emailExists = function(userObj, emailInput) {
  for (const user in userObj) {
    if(userObj[user].email === emailInput) {
      return true;
    }
  }
  return false;
}

app.get('/', (req, res) => {
  res.send('Hello!');
});

//adding additional endpoints to view our possible urls
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//sending html code for the client
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

//passing url data to our template and to our webpage
app.get('/urls', (req,res) => {
  const templateVars = { 
    urls : urlDatabase,
    userID: users[req.cookies['user_ID']]
  };
  res.render('urls_index', templateVars);
});

//adding new urls to submit
app.get('/urls/new', (req, res) => {
  const templateVars = { userID: users[req.cookies['user_ID']] };
  res.render('urls_new', templateVars);
});

//display single URL and its shortened form
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    userID: users[req.cookies['user_ID']]  
  };
  res.render('urls_show', templateVars);
});

//send url data to our registration template
app.get('/register', (req, res) => {
  const templateVars = {userID: users[req.cookies['user_ID']]};
  res.render('urls_registration', templateVars);
});

//add url data to our login template
app.get('/login', (req, res) => {
  const templateVars = { email: req.body.email, password: req.body.password, userID: users[req.cookies['user_ID']] };
  res.render('urls_login', templateVars);
})

//function to generate a random tinyURL
const generateRandomString = function() {
  let newShortURL = '';
  let characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 6; i++) {
    newShortURL += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return newShortURL;
};

//define route to match URL POST request
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//delete URL
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;

  delete urlDatabase[shortURL];

  res.redirect('/urls');
});

//edit URL
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  
  urlDatabase[shortURL] = longURL;

  res.redirect(`/urls/${shortURL}`);
});

//Login Route
app.post('/login', (req, res) => {
  let userID = req.body.userID;
  res.cookie('user_ID', userID);

  res.redirect('/urls');
});

//logout/clear cookie
app.post('/logout', (req, res) => {
  res.clearCookie('user_ID');

  res.redirect('/urls');
});

//add register endpoint to store user data in database
app.post('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    res.status(400).send('Please fill out email and password fields!');
    return;
  }
  if (emailExists(users, req.body.email)) {
    res.status(400).send('Account with this email already exists!');
    return;
  }
  const userID = generateRandomString();
  users[userID] = { 
    id: userID,
    email: req.body.email,
    password: req.body.password
  };

  res.cookie('user_ID', userID);
  
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});