// modules
var express = require('express')
  , http = require('http')
  , morgan = require('morgan');


// app parameters
var app = express();
app.use(express.static('../../dist/face'));
app.use(morgan('dev'));

// serve index

// HTTP server
var server = http.createServer(app);
server.listen(8080, function () {
  console.log('HTTP server listening on port ' + 8080);
});

// WebSocket server
var io = require('socket.io')(server);
io.on('connection', require('./socket'));

module.exports.app = app;