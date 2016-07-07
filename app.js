const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const debug = require('debug')('twolakebeer:server');
const express = require('express');
const extend = require('util')._extend;
const favicon = require('serve-favicon');
const logger = require('morgan');
const path = require('path');

// Modules
const indexRoutes = require('./routes/index');

const app = express();

// Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Locals
app.locals = extend(app.locals, {
  DEBUG: debug.enabled,
  activePage: function(test) {
    const route = this.sectionPath;
    const isActive = test === route;
    return isActive ? 'active' : '';
  },
  pageTitle: '',
  sectionPath: '',
  siteTitle: 'Two Lake Beer'
});

// Middleware
if (!debug.enabled) { app.use(compression()); }
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRoutes);

// Handle 404
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  res.locals.pageTitle = '404';
  next(err);
});

// Handle 500
app.use((err, req, res, next) => {
  res.locals.pageTitle = res.locals.pageTitle || '500';
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
