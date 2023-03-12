import React from 'react'

export default function SearchResult({song, chooseSong}) {
    function handlePlay(){
        chooseSong(song) // set {chooseSong} in Dashboard.js
    }
    /**
     * Style notes:
     * ml-3: space out song from album 
     * text-muted: lighter artist name than song name
     * pointer: set hover cursor
     */
  return (
    <div
    className="d-flex m-2 align-items-center"
    style={{ 
        cursor: "auto"
    }}
    onClick={handlePlay}
    >
        <img src={song.albumUrl} style={{height:"64px", width: "64px"}}/>
        <div className="ml-3">
            <div>{song.title}</div>
            <div className="text-muted">{song.artist}</div>
        </div>
    </div>
  )
}
