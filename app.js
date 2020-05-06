// Require modules
const express = require('express');
const morgan = require('morgan');
const playerRoutes = require('./routes/playerRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Middleware

// If we are in development we want to log to the console our HTTP request data
if (process.env.NODE_ENV === 'DEVELOPMENT') {
  app.use(morgan('dev'));
}
// Request middleware that parses json
app.use(express.json());

// Use middleware that adds to the request the time of request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Mount our player router
app.use('/api/v1/players', playerRoutes);

// Use global error handling middleware

app.all('*', (req, res, next) => {
  next(new Error(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
