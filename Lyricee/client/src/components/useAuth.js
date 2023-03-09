import { useState, useEffect } from'react'
import axios from 'axios'

//Logic for login authentication

export default function useAuth(code) {
    // const[data, setData] = useState([])
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
        //create route to post code param 
        axios.post("http://localhost:3000/login", {code,
        })
        .then(res => {
            //For testing
            // console.log(res.data)
            
            setAccessToken(res.data.accessToken)    
            setRefreshToken(res.data.refreshToken)
            setExpiresIn(res.data.expiresIn)

            //On page refresh: push root URL to remove old code 
            window.history.pushState({},null,'/')

        })
        .catch(()=>{//handle Authentication error API code expired

            //window.location='/' //redirect back to login page
        })

    }, [code])

    //For testing
    // console.log(refreshToken)

    /*To automate refresh so user doesn't need to login again. 
    Without this, the user will have to re-login every hour 
    See expiresIn-> console.log(res.data.expiresIn) for reference*/
    useEffect(()=>{

        /*Error handling: won't refresh if these endpoints aren't defined yet*/
        if(!refreshToken || !expiresIn) return
        
        /*To automatically refresh the page BEFORE the API expires*/
        const interval= setInterval(() => {
            
            //create route to post code param 
            axios
            .post("http://localhost:3000/refresh", {refreshToken,
            })
            .then(res => {
                //For testing  
                // console.log(res.data)
                
                setAccessToken(res.data.accessToken)    
                setExpiresIn(res.data.expiresIn)
                
            })
            .catch(()=>{//handle Authentication error API code expired
                window.location='/' //redirect back to login page
            })

        }, (expiresIn - 60)*1000)//refresh 1 min before API expires
        //subtract 60secs (*10000 to convert to milliseconds)

        //if refreshToken expires in less than 60 secs, clear timeout
        return () => clearInterval(interval)

    },[refreshToken, expiresIn])

       
    /** 
    @Return accessToken to access all Spotify API endpoints
    including search/play songs, etc.
    */
    return accessToken
}
