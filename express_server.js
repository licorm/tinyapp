//setting up our express server
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const { emailExistsInDatabase } = require('./helpers');
const { urlsForUser } = require('./helpers');
const { generateRandomString } = require('./helpers');

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));


//setting ejs as the view engine
app.set('view engine', 'ejs');


const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

//hashing current passwords for tests
const hashedPassword1 = bcrypt.hashSync('123', 10);
const hashedPassword2 = bcrypt.hashSync('dishwasher-funk', 10);

//users database
const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: hashedPassword1
  },
  "J48lW": {
    id: "J48lW",
    email: "user2@example.com",
    password: hashedPassword2
  }
};

//hello page
app.get('/', (req, res) => {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }

  res.redirect('/urls');
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
  const userID = req.session.userID;
  const urlsToView = urlsForUser(userID, urlDatabase);

  const templateVars = {
    urls : urlsToView,
    userID: users[req.session.userID]
  };
  res.render('urls_index', templateVars);
});

//adding new urls to submit
app.get('/urls/new', (req, res) => {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  const templateVars = { userID: users[req.session.userID] };
  res.render('urls_new', templateVars);
});


//display single URL and its shortened form
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  
  if (!req.session.userID) {
    res.status(403).send("Cannot access URL without signing in first");
    return;
  }

  if (urlDatabase[shortURL] === undefined) {
    res.status(400).send("That shortend URL doesn't exist");
    return;
  }

  const userID = (req.session.userID).toString();
  const urlsToView = urlsForUser(userID, urlDatabase);

  if (Object.keys(urlsToView).length === 0) {
    res.status(400).send("You don't have access to that URL");
    return;
  }
  
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[shortURL].longURL,
    userID: users[req.session.userID]
  };

  res.render('urls_show', templateVars);
});

//send url data to our registration template
app.get('/register', (req, res) => {
  const templateVars = {userID: users[req.session.userID]};
  res.render('urls_registration', templateVars);
});

//add url data to our login template
app.get('/login', (req, res) => {
  const templateVars = { userID: users[req.session.userID] };
  res.render('urls_login', templateVars);
});

//define route to match URL POST request
app.post('/urls', (req, res) => {
  if (!req.session.userID) {
    res.status(403).send("Cannot add new URL without signing in first");
    return;
  }
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const userID = (req.session.userID);
  urlDatabase[shortURL] = { longURL, userID};
  res.redirect(`/urls/${shortURL}`);
});

//click on shortURL => redirects to page
app.get('/u/:shortURL', (req, res) => {
  let shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;

  res.redirect(longURL);
});

//delete URL
app.post('/urls/:shortURL/delete', (req, res) => {
  if (!req.session.userID) {
    res.status(403).send("Cannot delete URL without signing in first");
    return;
  }

  const shortURL = req.params.shortURL;

  delete urlDatabase[shortURL];

  res.redirect('/urls');
});

//edit URL
app.post('/urls/:shortURL', (req, res) => {
  if (!req.session.userID) {
    res.status(403).send("Cannot edit URL without signing in first");
    return;
  }
  
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  
  const userID = (req.session.userID);

  urlDatabase[shortURL] = { longURL, userID };

  res.redirect(`/urls/${shortURL}`);
});

//Login Route
app.post('/login', (req, res) => {
  let userID = emailExistsInDatabase(users, req.body.email);
  if (!emailExistsInDatabase(users, req.body.email)) {
    res.status(403).send("There is no account with that email :(");
    return;
  }
  
  //checking to see if password matched encrypted password
  const password = req.body.password;
  const hashedPassword = users[userID].password;
  if (!bcrypt.compareSync(password, hashedPassword)) {
    res.status(403).send("Wrong password :(");
    return;
  }

  req.session.userID = userID;
 
  res.redirect('/urls');
});

//logout/clear cookie
app.post('/logout', (req, res) => {
  req.session = null;

  res.redirect('/urls');
});

//add register endpoint to store user data in database
app.post('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    res.status(400).send('Please fill out email and password fields!');
    return;
  }

  if (emailExistsInDatabase(users, req.body.email)) {
    res.status(400).send('Account with this email already exists!');
    return;
  }

  //encrypt our passwords as they come in
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const userID = generateRandomString();

  users[userID] = {
    id: userID,
    email: req.body.email,
    password: hashedPassword
  };

  req.session.userID = userID;
  
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});