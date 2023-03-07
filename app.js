require('dotenv').config();
const cors = require('cors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const { error } = require('console');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join('public', 'images_detail')));

app.use(cors());
app.use('/', indexRouter);

app.use(function (req, res, next) {
   const exception = new Error('Not found page');
   exception.statusCode = 404;
   next(exception);
});
app.use((err, req, res, next) => {
   res.status(err.statusCode).send(err.message);
});

module.exports = app;
