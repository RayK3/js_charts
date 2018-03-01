var express = require('express');
var http = require('http');

var app = express();

var data = '';

app.get('/JSON', function(req, res) {
  res.send(JSON.stringify({
    channels: Math.floor(Math.random() * 4),
    messages: Math.floor(Math.random() * 50),
    profiles: Math.floor(Math.random() *45),
    averageSent: `${(Math.random() * 10).toFixed(1)}` + '/10',
    lowestSent: `${(Math.random() * 5).toFixed(1)}` + '/10',
    highestSent: `${(Math.random() * 5 + 5).toFixed(1)}` + '/10',
  }));
});

app.listen(1337, function () {
	console.log('Server running at http://127.0.0.1:1337/');
});
