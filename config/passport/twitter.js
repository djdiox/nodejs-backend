'use strict';
/**
 * Twitter Strategy for Twitter
 * 
 * Created by Markus Wagner
 */
/**
 * Expose
 */

module.exports = {
  handlers: (mongoose, TwitterStrategy, config, User) => {
    const twitterCallback = (accessToken, refreshToken, profile, done) => {
      const options = {
        criteria: { 'twitter.id_str': profile.id }
      };
      User.load(options, function (err, user) {
        if (err) return done(err);
        if (!user) {
          user = new User({
            name: profile.displayName,
            username: profile.username,
            provider: 'twitter',
            twitter: profile._json
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
    return new TwitterStrategy({
      consumerKey: config.twitter.clientID,
      consumerSecret: config.twitter.clientSecret,
      callbackURL: config.twitter.callbackURL
    },
      twitterCallback
    );
  }
};