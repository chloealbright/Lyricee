# Lyricee
It's like Spotify meets Drive 2011: Retro Spotify theme lets users search, add favorites and listen to songs while viewing the song lyrics

## Contents
* [Features](#features)
* [APIs](#APIs)
* [Video Preview](#preview)

## Features
* Authenticates users upon sign in.
* Refreshes access_token before authentication expires, making for seemless play and continued listening.
* Users can search their favorite songs, artists, or albums.
* Users have access to lyrics display on music player while song is playing.
* Users can add or remove songs from their favorites.

(Note that users must have Spotify premium to use this app).


### Authentication

All methods require authentication, which can be done using these flows:

* [Client credentials](https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/) (Application-only authentication)
* [Authorization Code](https://developer.spotify.com/documentation/general/guides/authorization/) (Signed by user)
* [Implicit Grant Flow](https://developer.spotify.com/documentation/general/guides/authorization/implicit-grant/) (Client-side Authentication)


## Installation

## APIs
Dependencies include
* spotify-web-api-node for Authentication
$ npm install spotify-web-api-node --save
* react-spotify-web-playback for MusicPlayer
$ npm install react-spotify-web-playback
* lyrics-finder to pair lyrics with song playing (if available)
$ npm install lyrics-finder


#### Other Packages
* axios instead of fetch for seemless conversion to json object
$ npm install axios
* bootstrap for styling
$ npm install bootstrap
* dotenv for .env secured access key
$ npm install dotenv
* body-parser for parsing through json objects using .body elements
$ npm install body-parser
* cors for cross origin redirect http
$ npm install cors


## Preview
* [Lyricee Preview - Watch Video](https://www.loom.com/share/83c6b9ab24bf41a3b03908517933ab15)

![Login](https://user-images.githubusercontent.com/57193454/224539522-103b423d-d42a-400d-bfea-89d8f744ba2b.gif)

![Search](https://user-images.githubusercontent.com/57193454/224539563-c398b6ec-b425-4838-8abe-a5a5f838b2dd.gif)


