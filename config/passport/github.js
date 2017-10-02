'use strict';
/**
 * Expose
 */
module.exports = {
  handlers: (mongoose, GithubStrategy, config, User) => {
    const githubCallBack = (accessToken, refreshToken, profile, done) => {
      const options = {
        criteria: { 'github.id': parseInt(profile.id) }
      };
      User.load(options, function (err, user) {
        if (err) return done(err);
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'github',
            github: profile._json
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
    return new GithubStrategy({
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackURL
    },
      githubCallBack
    );
  }
};