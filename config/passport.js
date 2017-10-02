'use strict';
/**
 * Expose with DI
 */
module.exports = {


  /**
   * Creates an Instance of the passportHandler
   * 
   * @param {object} mongoose Mongoose ODB Manager
   * @param {object} local local stategy
   * @param {object} google google stategy
   * @param {object} twitter twitter stategy
   * @param {object} facebook facebook stategy
   * @param {object} linkedin linkedin strategy
   * @param {object} github github strategy
   * @param {object} User The User
   * @returns the method of the passport init.
   */
  handlers: (mongoose, local, google, twitter, facebook, linkedin, github, User) => {
    const passportHandler = (passport) => {
      // serialize and deserialize sessions
      passport.serializeUser((user, done) => done(null, user.id));
      passport.deserializeUser((id, done) => User.findOne({ _id: id }, done));
      // use these strategies
      passport.use(local);
      passport.use(google);
      passport.use(facebook);
      passport.use(twitter);
      passport.use(linkedin);
      passport.use(github);
    };
    return passportHandler;
  }
};
