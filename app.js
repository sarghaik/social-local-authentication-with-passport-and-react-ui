
require('./bin/run-mongo');
require('dotenv').config();
const express = require('express')
    , path = require('path')
    , favicon = require('serve-favicon')
    , logger = require('morgan')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , cookieSession    = require('cookie-session')
    , User = require('./app/models/user')
    , dbSetup = require('./db-connection')
    , cors = require('cors')
    , passport = require('passport');


const app = express();
const port = process.env.PORT || 5000;
dbSetup(process.env.TEST_DB_URL) ;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(cookieSession({ key: 'app.sess',
                  secret: 'coach'}));
app.use(passport.initialize());

app.use(passport.session());
app.use(require("./app/routes"));


app.listen(port, () => console.log(`Listening on port ${port}`));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
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