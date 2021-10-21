var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
let session = require('express-session');
let FileStore = require('session-file-store')(session);
const passport = require('passport');


// env varibale
const url = process.env.mongoUrl;

const connect = mongoose.connect(url);



connect.then((db) => {
  console.log('mongodb connected');
}, (err) => { console.log(err); });


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postRouter = require('./routes/blogposts/post');
const commentRouter = require('./routes/blogposts/comments');

var app = express();

// http to https
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// passport login
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/post', postRouter);
app.use('/post', commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
