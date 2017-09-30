/**
 * Expose
 */
module.exports = {

  /**
   * 
   * Creates the Local Strategy for Passport Authentification
   * 
   * @param {object} User The Mongoose Model of the User
   * @param {object} LocalStrategy The local Strategy object of Passport
   * @returns {object} Configured local Strategy
   */
  handlers: (User, LocalStrategy) => {
    return new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
      function (email, password, done) {
        var options = {
          criteria: { email: email }
        };
        User.load(options, function (err, user) {
          if (err) return done(err);
          if (!user) {
            return done(null, false, { message: 'Unknown user' });
          }
          if (!user.authenticate(password)) {
            return done(null, false, { message: 'Invalid password' });
          }
          return done(null, user);
        });
      }
    );
  }
};