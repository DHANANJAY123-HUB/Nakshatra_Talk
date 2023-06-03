const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser'); 
const session = require('express-session');
const fileUpload = require("express-fileupload");

const apiuserRouter = require('./routes/apiUser');
const apiastrologerRouter = require('./routes/apiAstrologer');
const adminRouter = require('./routes/admin');
const expertRouter = require('./routes/expert');


const app = express(); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'my pet name is monkey',saveUninitialized: true,resave: true}));
app.use('/uploads',express.static('uploads'))

app.use('/api/user', apiuserRouter);
app.use('/api/astrologer', apiastrologerRouter);
app.use('/admin', adminRouter);
app.use('/expert', expertRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
 if(res.status(err.status || 500)){
  res.render('505')
  }else{
  res.render('404')
}
});

module.exports = app;