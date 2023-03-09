import SpotifyPlayer from "react-spotify-web-playback"
import {useState, useEffect} from "react"


export default function MusicPlayer({accessToken, songUri}) {
    const[play, setPlay] = useState(false)
    useEffect(() => setPlay(true), [songUri])
    if(!accessToken) return null //don't render player without access token
    return(
        <SpotifyPlayer
        token={accessToken}
        showSaveIcon
        callback={state=>{
            if(!state.isPlaying) setPlay(false)
        }}
        play={play}
        uris={songUri? [songUri]:[]}
        />
    )
}
   
