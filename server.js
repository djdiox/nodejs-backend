'use strict';
/*
 * Generic backend Server Start Point
 * 
 * Created by Markus Wagner
 */

 /**
  * In first place we want to init the logger and set the logLevel
  * After that all other stuff will be done
  */
const winston = require('winston'),
  config = require('./config');
  winston.level = config.logLevel || 'info';
/**
 * Other Module dependencies
 */
const fs = require('fs'),
  join = require('path').join,
  express = require('express'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  session = require('express-session'),
  compression = require('compression'),
  morgan = require('morgan'),
  cookieParser = require('cookie-parser'),
  cookieSession = require('cookie-session'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  csrf = require('csurf'),
  mongoStore = require('connect-mongo')(session),
  flash = require('connect-flash'),
  helpers = require('view-helpers'),
  jade = require('jade'),
  pkg = require('./package.json'),
  LocalStrategy = require('passport-local').Strategy,
  app = express(),
  models = require('./config/bootstrap-models').handlers(join, winston, fs)(),
  local = require('./config/passport/local').handlers(models['User'], LocalStrategy),
  createMiddleware = require('./config/middleware').handlers(express, session, compression, morgan, cookieParser, cookieSession, bodyParser, methodOverride, csrf, mongoStore, flash, winston, helpers, jade, config, pkg);
/**
 * Loads the env file with dotenv library
 */
require('dotenv').config();

/**
 * Establishes an Connection with logging on MongoDB
 * 
 * @returns {Object} an Instance of the current MongoDB Connection
 */
const connectToMongoDB = (options) => {
  const connection = mongoose.connect(config.db, options).connection;
  connection.on('open', () => winston.info('Connected to the Database via ' + config.db));
  connection.on('error', err => winston.error(err));
  return connection;
};

/**
 * Performs an Listen on a specify port
 * 
 * @param port specefies an port which will be used for the HTTP Server
 * 
 */
const listen = (port) => {
  if (app.get('env') === 'test') return;
  app.listen(port);
  winston.info('Listening with Express on Port: ' + port);
};

/**
 * Initializes the complete Application
 * Including following Components:
 * - Models
 * - Passport
 * - Express
 * - Routes
 * 
 * @returns {Object} The Current Instance of the Connection
 */
const init = () => {
  const options = { server: { socketOptions: { keepAlive: 1 } } };
  const port = process.env.PORT || 3000;

  // Bootstrap routes

  createMiddleware(app, passport);
  require('./config/routes')(app, passport);

  require('./config/passport')
    .handlers(mongoose, local, mongoose.model('User'))(passport);
  // Initialize Express
  const connection = connectToMongoDB(options);
  connection
    .on('error', err => winston.error(err))
    .on('disconnected', () => connectToMongoDB(options))
    .once('open', () => listen(port));
  return connection;
};

/**
 * Run Initialization
 */
(() => {
  const connection = init();
  /**
   * Expose
   */
  module.exports = {
    app,
    connection
  };
})();