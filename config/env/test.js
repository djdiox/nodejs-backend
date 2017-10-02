
/**
 * Expose
 */

module.exports = {
  db: 'mongodb://localhost/dashboardDB',
  port: 3000,
  logLevel: 'debug',
  baseUrl: 'http://localhost:3000',
  facebook: {
    clientID: 'testFb',
    clientSecret: 'clientSecretFb',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  twitter: {
    clientID: 'testTwitter',
    clientSecret: 'clientSecretTwitter',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  },
  github: {
    clientID: 'testGithub',
    clientSecret: 'clientSectetGitHub',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  google: {
    clientID: 'testGoogle',
    clientSecret: 'secretTwitter',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  spotify: {
    clientId: 'testSpotify',
    clientSecret: 'secretSpotify',
    redirectUri: 'http://localhost:3000/spotify'
  }
};
