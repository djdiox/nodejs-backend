'use strict';
/*
 * Generic backend Server Start Poinrt
 * 
 * Created by Markus Wagner
 */

/**
 * Loads the env file with dotenv library
 */
require('dotenv').config();

/**
 * Module dependencies
 */
const fs = require('fs'),
  join = require('path').join,
  express = require('express'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  config = require('./config'),
  log = require('winston'),
  app = express();

/**
 * Establishes an Connection with logging on MongoDB
 * 
 * @returns {Object} an Instance of the current MongoDB Connection
 */
const connectToMongoDB = () => {
  const options = { server: { socketOptions: { keepAlive: 1 } } };
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
  const models = join(__dirname, 'app/models');
  // Bootstrap models
  fs.readdirSync(models)
    .filter(file => ~file.indexOf('.js'))
    .forEach(file => require(join(models, file)));

  // Bootstrap routes
  require('./config/passport')(passport);
  require('./config/express')(app, passport);
  require('./config/routes')(app, passport);

  // Initialize Express
  const connection = connectToMongoDB();
  const port = process.env.PORT || 3000;
  connection
    .on('error', err => log.error(err))
    .on('disconnected', connectToMongoDB)
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