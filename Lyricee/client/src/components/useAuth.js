import { useState, useEffect } from'react'
import axios from 'axios' //using axios instead of fetch for automatic json conversion


export default function useAuth(code) {
    // const[data, setData] = useState([])
    // const[tokenType, setTokenType]= useState()
    // const[response, setResponse] = useState()
    const[accessToken, setAccessToken] = useState()
    const[refreshToken, setRefreshToken] = useState()
    const[expiresIn, setExpiresIn] = useState()
    

    /** 
    store the following data returned from server.js: 
    @param accessToken
    @param refreshToken
    @param expiresIn
    */ 

    

    useEffect(() => {
        // Create route to post return access and refresh tokens in 'code' from server.js
        axios.post("http://localhost:3001/login", {code,
        })
        .then(res => {
            // For testing
            // console.log(res.data)
            
            setAccessToken(res.data.accessToken)      
            setRefreshToken(res.data.refreshToken)
            setExpiresIn(res.data.expiresIn)

            // On page refresh: push out root URL to remove old code 
            window.history.pushState({},null,'/')

        })
        .catch(()=>{// Handle Authentication error API code expired
            window.location='/' // Redirect back to root, i.e login page
        })

    }, [code])


    /** To automate refresh so user doesn't need to login again. 
    Without this, the user will have to re-login every hour 
    See expiresIn-> console.log(res.data.expiresIn) for reference */
    useEffect(()=>{

        /* ERROR Handling: won't refresh if these endpoints aren't defined yet*/
        if(!refreshToken || !expiresIn) return
        
        /* To automatically refresh the page BEFORE the API expires*/
        const interval= setInterval(() => {
            
            // Create route to post code param api/token
            axios
            .post("http://localhost:3001/refresh", {refreshToken,
            })
            .then(res => {
                //For testing  
                // console.log(res.data)
                
                setAccessToken(res.data.accessToken)    
                setExpiresIn(res.data.expiresIn)
                
            })
            .catch(()=>{// Handle Authentication Error: API code expired
                window.location='/' // Redirect back to login page
            })

        }, (expiresIn - 59)*1000)
        // Refresh <1 min before API expires
        // Subtract 59secs (*10000 to convert to milliseconds)

        // If refreshToken expires in less than 60 secs, clear timeout
        return () => clearInterval(interval)

    },[refreshToken, expiresIn])

       
    /** 
    @Return accessToken to access all Spotify API endpoints
    including search/play songs, etc.
    */
    return accessToken
}
