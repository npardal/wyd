const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose'); // Include mongoose
const port = process.env.PORT || 3001;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users'); // Import users router

const app = express();

const uri = "mongodb+srv://nicolepardall:Dobelove123%24@htndb.8i1gw.mongodb.net/?retryWrites=true&w=majority&appName=htnDB";
const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true }
};

mongoose.connect(uri, clientOptions)
  .then(() => {
    console.log("Successfully connected to MongoDB!");

    // Only start the server if MongoDB connection is successful
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });


  const connectedClients = {}; // Track connected clients

  wss.on('connection', (ws, req) => {
    const userId = req.url.split('/')[1]; // Assume userId is passed in the WebSocket URL
    connectedClients[userId] = ws; // Save WebSocket connection
    console.log(`User ${userId} connected`);
  
    ws.on('close', () => {
      delete connectedClients[userId]; // Remove on disconnect
      console.log(`User ${userId} disconnected`);
    });
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add this to link /users routes to the usersRouter
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
