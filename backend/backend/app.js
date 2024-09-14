const createError = require('http-errors');
const express = require('express');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const WebSocket = require('ws');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const uri = "mongodb+srv://nicolepardall:Dobelove123%24@htndb.8i1gw.mongodb.net/?retryWrites=true&w=majority&appName=htnDB";
const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true }
};

mongoose.connect(uri, clientOptions)
  .then(() => {
    console.log("Successfully connected to MongoDB!");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

const connectedClients = {};

wss.on('connection', function connection(ws, req) {
  const userId = req.url.split('/')[1];  // Extract userId from URL, adjust as needed.
  connectedClients[userId] = ws;

  console.log(`User ${userId} connected`);

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.on('close', function() {
    console.log(`User ${userId} disconnected`);
    delete connectedClients[userId];
  });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

server.listen(3001, () => {
  console.log(`Server running on port 3001`);
});

module.exports = app;
