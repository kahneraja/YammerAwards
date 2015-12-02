var express = require('express');
var fs = require('fs');
var app = express();


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

app.post('/save', function(request, respond) {
    var body = '';
    filePath = __dirname + '/public/data.json';
    request.on('data', function(data) {
        body += data;
    });

    request.on('end', function (){
        fs.appendFile(filePath, body, function() {
            respond.end();
        });
    });
});


app.use(express.static('public'));

app.listen(3000);