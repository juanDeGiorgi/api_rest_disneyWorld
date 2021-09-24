const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const env = require("dotenv").config();

const moviesRouter = require('./routes/moviesRouter');
const charactersRouter = require('./routes/charactersRouter');

const app = express();

app.use(express.static(path.join(__dirname, 'uploads')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/movies', moviesRouter);
app.use('/characters', charactersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  const message = err.message;
  const error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  const responseError = {
    msj : message,
    error : err
  }

  res.status(err.status || 500);
  res.json(responseError);
});

module.exports = app;
