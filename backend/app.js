// app.js
require('dotenv').config();
const express = require('express');
const path = require('path');

var logger = require('morgan');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
bodyParser = require('body-parser');
var cors = require('cors')

const app = express();
app.use(express.json());// ))))))
app.use(cors())

const route = require('./routes/index');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // Phục vụ file tĩnh (ảnh)


// routes init
route(app);

// app.listen(port, () => console.log(`http://localhost:${port}`));

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
    res.status(err.status || 500);
    res.render('error');
  });
  

module.exports = app;

// import { createRoot } from 'react-dom/client';

// // Clear the existing HTML content
// document.body.innerHTML = '<div id="app"></div>';

// // Render your React component instead
// const root = createRoot(document.getElementById('app'));
// root.render(<h1>Hello, world</h1>);