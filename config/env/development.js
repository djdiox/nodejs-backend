
/**
 * Expose
 */

module.exports = {
  db: 'mongodb://localhost/dashboardDB',
  port:3000,
  logLevel:'debug',
  facebook: {
    clientID: 'APP_ID',
    clientSecret: 'SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    scope: [
      'email',
      'user_about_me',
      'user_friends'
    ]
  },
  google: {
    clientID: 'APP_ID',
    clientSecret: 'SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.google.com/m8/feeds',
    ]
  },
  spotify: {
    clientId : '6e9b262dcf6e406e84fda5591bda5f2e',
    clientSecret : '46cfe8fa777b4801b3224036b5ef3337',
    redirectUri : 'http://localhost:3000/spotify'
  }
};
