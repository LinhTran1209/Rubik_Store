require('dotenv').config();
const express = require('express');
const path = require('path');
var logger = require('morgan');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
bodyParser = require('body-parser');
var cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // địa chỉ của frontend
    credentials: true, // Cho phép gửi cookie
}));

// app.use(cors());

const route = require('./routes/index');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// routes init
route(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
