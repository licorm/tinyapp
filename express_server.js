//setting up our express server
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

//function to generate a random tinyURL
const generateRandomString = function(req.body.longURL) {
  let characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let newShortURL = '';
  for (let i = 0; i < 7; i++) {
    newShortURL += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return newShortURL;
}

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
  res.send('<html><body>Hello <b>World</b></body></html>\n')
});

//passing url data to our template and to our webpage
app.get('/urls', (req,res) => {
  const templateVars = { urls: urlDatabase};
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
})

//define route to match URL POST request
app.post('/urls', (req, res) => {
  console.log(req.body);
  res.send('OK');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});