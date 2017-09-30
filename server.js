'use strict';
/*
 * Generic backend Server Start Point
 * 
 * Created by Markus Wagner
 */

/**
 * Module dependencies
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
  winston = require('winston'),
  helpers = require('view-helpers'),
  jade = require('jade'),
  config = require('./config'),
  pkg = require('./package.json'),
  log = require('winston'),
  LocalStrategy = require('passport-local').Strategy,
  app = express();
(() => {
  // Bootstrap models
  const modelsPath = join(__dirname, 'app/models');
  const models = fs.readdirSync(modelsPath)
    .filter(file => ~file.indexOf('.js'));
  log.debug('Injected Models', models);
  models.forEach(file => require(join(modelsPath, file))); // Inject each Model
})();
const local = require('./config/passport/local').handlers(mongoose.model('User'), LocalStrategy),
  expressCreator = require('./config/express').handlers(express, session, compression, morgan, cookieParser, cookieSession, bodyParser, methodOverride, csrf, mongoStore, flash, winston, helpers, jade, config, pkg);

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
  connection.on('open', () => log.info('Connected to the Database via ' + config.db));
  connection.on('error', err => log.error(err));
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
  log.info('Listening with Express on Port: ' + port);
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

  expressCreator(app, passport);
  require('./config/routes')(app, passport);

  require('./config/passport')
    .handlers(mongoose, local, mongoose.model('User'))(passport);
  // Initialize Express
  const connection = connectToMongoDB(options);
  connection
    .on('error', err => log.error(err))
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