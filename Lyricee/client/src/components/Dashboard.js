import {useState, useEffect} from 'react';
import useAuth from './useAuth' //for login authentication
import {Container, Form} from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"

import axios from "axios"
import MusicPlayer from "./MusicPlayer"
import SearchResult from './SearchResult';

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
      setSearch("")
      setLyrics("")
    }
    useEffect(() => {
      if (!playingSong) return
  
      axios
        .get("http://localhost:3000/lyrics", {
          params: {
            song: playingSong.title,
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
      if (!search) return setSearchResults([])
      if (!accessToken) return
  
      let cancel = false
      spotifyApi.searchTracks(search).then(res => {
        if (cancel) return
        setSearchResults(
          res.body.tracks.items.map(track => {
            const smallestAlbumImage = track.album.images.reduce(
              (smallest, image) => {
                if (image.height < smallest.height) return image
                return smallest
              },
              track.album.images[0]
            )
  
            return {
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: smallestAlbumImage.url,
            }
          })
        )
      })
  
      return () => (cancel = true)
    }, [search, accessToken])
  
    return (
      <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
        <Form.Control
          type="search"
          placeholder="Search Songs/Artists"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
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
