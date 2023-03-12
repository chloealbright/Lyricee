const express = require('express');
const cors = require('cors'); // For secure cross origin requests between browser & server
const bodyParser = require('body-parser'); // Parse body for the code param of URL
const SpotifyWebApi = require('spotify-web-api-node');
const lyricsFinder = require('lyrics-finder');

require('dotenv').config();

 

/** Instantiate WRAPPER Example
 const spotifyWebApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    //use APIs set method to set access token
    spotifyWebApi.setAccessToken(accessToken);
 */


const app = express();


app.use(cors()); // Handle cross origin http redirect
app.use(bodyParser.json()); // JSON body parser for .body elements
app.use(bodyParser.urlencoded({ extended: true })); // for parsing query param for get 




app.post("/refresh", (req,res)=>{ // Handle automatic refresh of access token
    const refreshToken = req.body.refreshToken // Get refreshToken from client 
    console.log("test")
    const spotifyApi = new SpotifyWebApi({
        //redirectUri: process.env.REDIRECT_URI,
        grant_type: 'refresh_token',
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        refreshToken: refreshToken,
    })
   
    
    // set clientId, clientSecret and refreshToken to the api object from the previous call
    spotifyApi
    .refreshAccessToken()
    .then((data) =>{
        //access data from response call
        console.log(data.body);
        res.json({
            accessToken: data.body.access_token,
            expiresIn: data.body.expires_in,
        })
        })
        .catch((err) => {
            //For testing
            console.log("refresh server "+err);
            res.sendStatus(400)
        })
        
})



app.post("/login", (req, res) => {
    // const state = generateRandomString(16);
    // let scope = "user-read-private user-read-email";
    //returned as a query param for the redirect URI
   const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        grant_type: 'authorization_code',
        //responseType: "code", //can be exchanged for an access token on callback refirect uri
        clientId: process.env.SPOTIFY_CLIENT_ID, //set to 'CLIENT_ID' in example
        // scope: scope,
        redirectUri: process.env.REDIRECT_URI, //set to localhost:3000/callback
        // state: state, //value of state param supplied in the request
        // show_dialogue: false, //users who approved the app will be automatically directed in redirect_uri
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET, //need? not in code
    })

    spotifyApi
    .authorizationCodeGrant(code)
    .then(data =>{
        res.json({ //return access and refresh tokens for authentication
            // responseType: 'code',
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    })//send error if not authorized
    .catch((err)=>{
        //For testing
        console.log("login server "+err);
        res.sendStatus(400)
    })
    
    app.get("/lyrics", async (req, res) => {
        const lyrics=
        (await lyricsFinder(req.query.artist, req.query.track)) || "No lyrics found"
        res.json({lyrics})
    })
})
// Firebase portion
// app.get('/redirect', (req, res) => {
//     // Generate a random state verification cookie.
//     const state = req.cookies.state || crypto.randomBytes(20).toString('hex');
//     // Allow unsecure cookies on localhost.
//     const secureCookie = req.get('host').indexOf('localhost:') !== 0;
//     res.cookie('state', state.toString(), {maxAge: 3600000, secure: secureCookie, httpOnly: true});
//     const redirectUri = oauth2.authorizationCode.authorizeURL({
//       redirect_uri: `${req.protocol}://${req.get('host')}/spotify-callback`,
//       scope: 'basic',
//       state: state
//     });
//     res.redirect(redirectUri);
//   });


app.listen(3001)
/**
 * Alternative
 * const port = normalizePort(process.env.PORT || '3001');
 * where PORT=3000
 * app.set('port', port);
 */
