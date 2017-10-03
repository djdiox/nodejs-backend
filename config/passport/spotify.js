/**
 * The Passport Strategy for Spotify.
 * 
 * Let's an User creates an Account via Spotify
 * 
 * Created by Markus Wagner
 */
module.exports = {
    handlers: (SpotifyStrategy, config, User) => {
        const spotifyCallback = (accessToken, refreshToken, profile, done) => {
            User.findOrCreate({ spotifyId: profile.id }, (err, user) => done(err, user));
        };
        return new SpotifyStrategy({
            clientID: config.spotify.clientId,
            clientSecret: config.spotify.clientId,
            callbackURL: config.spotify.callbackURL
        }, spotifyCallback);
    }
};