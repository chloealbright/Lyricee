import SpotifyPlayer from "react-spotify-web-playback"
import {useState, useEffect} from "react"


export default function MusicPlayer({accessToken, songUri}) {

    const[play, setPlay] = useState(false)
    useEffect(() => setPlay(true), [songUri])
    if(!accessToken) return null // don't render player without access token
    return(
            <SpotifyPlayer
            token={accessToken}
            showSaveIcon // save songs to spotify library
            callback={state=>{
                if(!state.isPlaying) setPlay(false) 
            }} // stops play when song is finished, paused, or changes

            play={play} // set to true whenever songUri changes
            uris={songUri? [songUri]:[]}

            styles={{
                bgColor: 'rgb(31,18,17)',
                color: 'white',
                sliderColor: '#1cb954',
                trackArtistColor: 'white',
                trackNameColor: 'white'
              }}
            />
        
    )
}
   
