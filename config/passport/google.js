'use strict';
/**
 * Expose
 */

module.exports = {
  handlers: (mongoose, GoogleStrategy, config, User) => {
    const googleCallback = (accessToken, refreshToken, profile, done) => {
      const options = {
        criteria: { 'google.id': profile.id }
      };
      User.load(options, function (err, user) {
        if (err) return done(err);
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'google',
            google: profile._json
          });
          user.save(function (err) {
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    };
    return new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
      googleCallback
    );
  }
};