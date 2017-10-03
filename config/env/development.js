/**
 * Server Settings
 * Will be set via ENV File in Production
 */
const config = {
  db: 'mongodb://localhost/dashboardDB',
  port: 3000,
  logLevel: 'debug',
  baseUrl: 'http://localhost:3000',
  facebook: {
    clientID: process.env.FACEBOOK_CLIENTID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_CLIENTID,
    clientSecret: process.env.TWITTER_SECRET,
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  },
  github: {
    clientID: process.env.GITHUB_CLIENTID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  google: {
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  spotify: {
    clientId: '6e9b262dcf6e406e84fda5591bda5f2e',
    clientSecret: '46cfe8fa777b4801b3224036b5ef3337',
    callbackURL: 'http://localhost:3000/spotify'
  }
};
/**
 * Expose
 */
module.exports = config;