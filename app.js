// Require modules
const express = require('express');
const morgan = require('morgan');
const playerRoutes = require('./routes/playerRoutes');
const viewRoutes = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const path = require('path');
const compression = require('compression');
const app = express();

// Configure pug as our templating engine
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// Middleware

// If we are in development we want to log to the console our HTTP request data
if (process.env.NODE_ENV === 'DEVELOPMENT') {
  app.use(morgan('dev'));
}
// Request middleware that parses json
app.use(express.json());

// Middleware that compresses text sent to the client
app.use(compression());

// Use middleware that adds to the request the time of request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Mount our routers
app.use('/', viewRoutes);
app.use('/api/v1/players', playerRoutes);

// Use global error handling middleware

app.all('*', (req, res, next) => {
  next(new Error(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
