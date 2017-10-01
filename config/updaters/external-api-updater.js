/**
 * The handler for Spotify Route access.
 */
module.exports = {
    handlers: (spotifyApi, Rx, log) => {

        // const timer = Rx.Observable.timer(1000 * 60 * 60);

        const getCurrentTopData = async (authorizationCode) => {
            const credentialData = await spotifyApi.clientCredentialsGrant();
            spotifyApi.setAccessToken(credentialData.body['access_token']);
            // const currentUser = await spotifyApi.authorizationCodeGrant(authorizationCode);
            // log.info(currentUser);
            // const userPlaylists = await spotifyApi.getUserPlaylists();
            // log.debug(userPlaylists);
        };

        return {
            getCurrentTopData
        };
    }
};