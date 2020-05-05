const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
require('dotenv').config();
const cors = require('cors');

const indexRouter = require('./routes');
const connect = require('./models');
const passportConfig = require('./passport');
const logger = require('./logger');

const app = express();

passportConfig(passport);

// connect with mongodb
connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middleware
app.use(cors());

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  }
};

if (process.env.NODE_ENV === 'production') {
  sessionOption.proxy = true;
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
// app.use(passport.session());

const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);


const { verifyToken } = require('./routes/middleware');

//routing
app.use('/', indexRouter);
app.use('/api/v1/users', verifyToken, require('./routes/users'));
app.use('/api/v1/categories', require('./routes/categories'));
app.use('/api/v1/posts', require('./routes/posts'));
app.use('/auth', require('./routes/auth'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  logger.info('hello');
  logger.error(err.message);
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
