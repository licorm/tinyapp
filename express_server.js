//setting up our express server
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));

//setting ejs as the view engine
app.set('view engine', 'ejs');

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

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
  const templateVars = { urls : urlDatabase};
  res.render('urls_index', templateVars);
});

//adding new urls to submit
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

//display single URL and its shortened form
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls_show', templateVars);
});

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
  let usernameCookie = req.body.username;
  res.cookie('username', usernameCookie);

  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});