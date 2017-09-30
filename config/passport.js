'use strict';
/**
 * Expose with DI
 */
module.exports = {  
  
  /**
   * Creates an Instance of the passportHandler
   * 
   * @param {object} mongoose Mongoose ODB Manager
   * @param {object} local Passport
   * @param {object} User The User
   * @returns the method of the passport init.
   */
  handlers: (mongoose, local, User) => {
    const passportHandler = (passport) => {
      // serialize and deserialize sessions
      passport.serializeUser((user, done) => done(null, user.id));
      passport.deserializeUser((id, done) => User.findOne({ _id: id }, done));
      // use these strategies
      passport.use(local);
    };
    return passportHandler;
  }
};
