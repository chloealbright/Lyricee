const express = require('express');
const cors = require('cors'); //handle cors block from http redirect
const bodyParser = require('body-parser'); //parse body for the code param of URL
const SpotifyWebApi = require('spotify-web-api-node');

require('dotenv').config();


const app = express();
app.use(cors());
app.use(bodyParser.json()); //JSON body parser for .body elements
app.use(bodyParser.urlencoded({ extended: true }));


app.post("/refresh", (req,res)=>{
    const refreshToken = req.body.refreshToken
    console.log("test")
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        refreshToken,
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
            // res.sendStatus(400)
        })
        
})



//For testing console.log(refreshToken)

app.post("/login", (req, res) => {
    //returned as a query param for the redirect URI
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    })

    spotifyApi
    .authorizationCodeGrant(code)
    .then(data =>{
        res.json({ //return from API
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
        // // 'true' param means async, it is also the default
        // spotifyApi.open('GET', data, true);
        // spotifyApi.send();
    })//catch error
    .catch((err)=>{
        //For testing
        console.log("login server "+err);
        // res.sendStatus(400)
    })
    
    app.get("/lyrics", async (req, res) => {
        const lyrics=
        (await lyricsFinder(req.query.artist, req.query.track)) || "No lyrics found"
        res.json(lyrics)
    })
})

app.listen(3000)
