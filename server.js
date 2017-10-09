'use strict';
/*
 * Generic backend Server Start Point
 * 
 * Created by Markus Wagner
 */

/**
 * In first place we want to init the logger and set the logLevel
 * After that all other stuff will be done
 * Loads the env file with dotenv library
 */
const winston = require('winston'),
  config = require('./config');
winston.level = config.logLevel || 'info';
require('dotenv').config();

/**
 * Override Promise library and set mongoose default Promise
 * Since overriding javascript's default libs with a lib is not best practice, disable eslint.
 * For now its fine, since its removes a lot of injects etc.
 */
Promise = require('bluebird');// eslint-disable-line
const mongoose = require('mongoose');
mongoose.Promise = Promise;
/**
 * Other Module dependencies
 */
const fs = require('fs'),
  join = require('path').join,
  express = require('express'),
  // SpotifyWebApi = require('spotify-web-api-node'),
  // spotifyApi = new SpotifyWebApi({
  //   clientId: config.spotify.clientId,
  //   clientSecret: config.spotify.clientSecret,
  //   redirectUri: config.spotify.redirectUri
  // }),
  passport = require('passport'),
  // FacebookStrategy = require('passport-facebook').Strategy,
  // LocalStrategy = require('passport-local').Strategy,
  // GithubStrategy = require('passport-github').Strategy,
  // TwitterStrategy = require('passport-twitter').Strategy,
  // GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  // SpotifyStrategy = require('passport-spotify').Strategy,
  session = require('express-session'),
  compression = require('compression'),
  morgan = require('morgan'),
  cookieParser = require('cookie-parser'),
  cookieSession = require('cookie-session'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  csurf = require('csurf'),
  mongoStore = require('connect-mongo')(session),
  flash = require('connect-flash'),
  helpers = require('view-helpers'),
  jade = require('jade'),
  cors = require('cors'),
  pkg = require('./package.json'),
  app = express(),
  rxjs = require('rxjs'),
  _ = require('lodash'),
  {
    // These are the basic GraphQL types need in this tutorial
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    // This is used to create required fileds and arguments
    GraphQLNonNull,
    // This is the class we need to create the schema
    GraphQLSchema,
  } = require('graphql'),
  { buildSchema } = require('graphql'),
  models = require('./config/bootstrap-models').handlers(join, winston, fs)(),
  UserType = require('./app/graphql/types/user-type').handlers(),
  TodoType = require('./app/graphql/types/todo-type').handlers(_, mongoose.model('Todo'), UserType, GraphQLObjectType, GraphQLNonNull, GraphQLString),
  graphQLSchema = require('./app/graphql/schema').handlers(buildSchema, _, TodoType, mongoose.model('Todo'), winston, GraphQLObjectType, GraphQLList, GraphQLSchema),
  // spotify = require('./config/passport/spotify').handlers(SpotifyStrategy, config, models['User']),
  // google = require('./config/passport/google').handlers(mongoose, GoogleStrategy, config, models['User']),
  // facebook = require('./config/passport/facebook').handlers(mongoose, config, FacebookStrategy, models['User']),
  // twitter = require('./config/passport/twitter').handlers(mongoose, TwitterStrategy, config, models['user'],
  // github = require('./config/passport/github').handlers(mongoose, config, GithubStrategy, models['User']),
  // local = require('./config/passport/local').handlers(models['User'], LocalStrategy),
  bootstrapMiddleware = require('./config/middleware').handlers(express, session, compression, morgan, cookieParser,
    cookieSession, bodyParser, methodOverride, csurf, mongoStore, flash, winston, helpers, jade, config, pkg, cors);
  // externalApiUpdater = require('./config/updaters/external-api-updater').handlers(spotifyApi, rxjs, winston);
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

  // Bootstrap middleware
  bootstrapMiddleware(app, passport);
  // Bootstrap routes
  require('./config/routes')(app, passport, graphQLSchema);
  // externalApiUpdater.getCurrentTopData();
  // require('./config/passport')
  //   .handlers(mongoose, local, mongoose.model('User'))(passport);
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