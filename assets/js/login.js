const clientId = '94c8b59bc8ae4c729724d22d2e4c3d9d'
const redirectUri = 'https://icaropvn.github.io/ShuffleFy/callback'
const scopes = 'playlist-read-private playlist-modify-private playlist-modify-public'

const URLparams = {
    response_type: 'token',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes
}

let loginButton = document.getElementById('login-button')

loginButton.addEventListener('click', () => {
    const authURL = `https://accounts.spotify.com/authorize?${new URLSearchParams(URLparams).toString()}`

    window.location.href = authURL
})