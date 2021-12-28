const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = "http://localhost:3000/auth";
const clientId = 'a081ffae612e47778c0c8b02e8d2b842';

const scopes = [
  'user-library-read',
  'streaming',
  'playlist-read-collaborative',
  'user-read-email',
  'playlist-read-private',
  'user-top-read',
  'user-read-recently-played',
];

const loginUrl = `${authEndpoint}?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes.join(
"%20"
)}`

const SpotifyConfig = {
  loginUrl: loginUrl,
  scopes: scopes,
  clientId: clientId,
  redirectUri,
  authEndpoint,
};

export default SpotifyConfig;