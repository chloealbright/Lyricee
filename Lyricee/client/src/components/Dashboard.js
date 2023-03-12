import {useState, useEffect} from 'react';
import useAuth from './useAuth' // For login authentication
import {Container, Form} from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
// Alternative package: import SpotifyWebApi from "spotify-web-api-js"

import axios from "axios"
import MusicPlayer from "./MusicPlayer"
import SearchResult from './SearchResult';

// use Spotify Web API for access token
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
})

export default function Dashboard({code}){
    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingSong, setPlaying] = useState()
    const [lyrics, setLyrics]= useState("")

    function chooseSong(song){
      setPlaying(song)
      setSearch("") // clear search 
      setLyrics("")
    }
    useEffect(() => {
      if (!playingSong) return
  
      axios 
        .get("http://localhost:3001/lyrics", {// send lyrics-request to server
          params: {
            track: playingSong.title,
            artist: playingSong.artist,
          },
        })
        .then(res => {
          setLyrics(res.data.lyrics)
        })
    }, [playingSong])
  
    useEffect(() => {
      if (!accessToken) return
      spotifyApi.setAccessToken(accessToken)
    }, [accessToken])
  
    useEffect(() => {
      if (!search) return setSearchResults([]) // If search is empty, clear search results
      if (!accessToken) return
  
      let cancel = false // Set to true to cancel the search request
      spotifyApi.searchTracks(search).then(res => { 
        // Map results for return 
        // console.log(res.body.tracks.items)
        if (cancel) return 
        setSearchResults(
          res.body.tracks.items.map(song => {
            const smallestAlbumImage = song.album.images.reduce(
              // loop through album images and return smallest
              (smallest, image) => {
                if (image.height < smallest.height) return image
                return smallest
              },
              song.album.images[0]
            )
  
            return {
              artist: song.artists[0].name,
              title: song.name,
              uri: song.uri,
              albumUrl: smallestAlbumImage.url,
            }
          })
        )
      })
      // set cancel to the previous request to true 
      // if a new request is made during the search
      return () => (cancel = true) 
    }, [search, accessToken])

    //set background
  const Background = require('../assets/retrodrive.gif');
  const divBackground = {
      width: '100%',
      height: '800px',
      backgroundImage: `url(${Background})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: 'cover'
  };

  
    return (
      // for testing: <div>{code}</div>
      // flex box column and flex col = vertical 
      /**
       * Style notes: 
       * d-flex: flexbox container
       * flex-column: align vertically
       * py-2: add top & bottom padding  
       * set container height to 100vh: search bar-top, music-middle, player-bottom
       * flex-grow-1: grow to fill container
       * my-2: add top & bottom margin
       * overflowY: auto, allow scrolling for lyrics if applicable
       * white-space: pre, allows new lines to be displayed
       */
      <Container className="d-flex flex-column py-2" 
      style={{
        height: "100vh",
        backgroundColor: "rgba(31,18,17,0.5)",
        color: "white"
      }}>
        <Form.Control
          type="search"
          placeholder="Search Songs/Artists" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            backgroundColor:"rgb(31,18,17)",
            color:"white"
          }}
        />
        <div className="flex-grow-1 my-2" 
        style={{ 
          overflowY: "auto"
        }}>
          {searchResults.map(song => (
            <SearchResult
              song={song}
              key={song.uri}
              chooseSong={chooseSong}
            />
          ))}
          {searchResults.length === 0 && (
            <div className="text-center" style={{ whiteSpace: "pre" }}>
              {lyrics}
            </div>
          )}
        </div>
        <div>
          <MusicPlayer accessToken={accessToken} songUri={playingSong?.uri} />
        </div>
      </Container>
    )
   
}
