import '../styles/Login.css';
import React from 'react'
import { Container } from 'react-bootstrap'

/*SCOPES to access:
streaming, 
user-email, 
read-private for user info, 
library-read to check if song is in user's favorited library,
library-modify to add songs to user's favorited library,
user-read-playback-state to check if user is playing a song,
user-modify-playback-state to change user's playback state,
user-read-currently-playing to check if user is currently playing a song
  */
const AUTH_URL="https://accounts.spotify.com/authorize?client_id=fdaa7bc856bb452f8f3755006b186319&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"
    
export default function Login() {

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >

        <a className='btn btn-success btn-lg' href={AUTH_URL}>
            Login with Spotify
        </a>
    </Container>
  )
}
