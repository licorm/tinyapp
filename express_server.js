//setting up our express server
const express = require('express');
const app = express();
const PORT = 8080;

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
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});