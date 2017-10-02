/**
 * The handler for Spotify Route access.
 */
module.exports = {
    handlers: () => {
        // credentials are optional
        const spotifyCallback = (req, res, next) => {
            console.log(req);
        };
        return {
            spotifyCallback
        };
    }
};