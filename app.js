const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send({
    "staus" : "App is up and running.."
  });
});

app.get('/home', (req, res) => {
  res.send({
    "staus" : "Home page is up and running"
  });
});

app.get('/error', (req, res) => {
  process.exit(1);
});

app.listen(8080);
