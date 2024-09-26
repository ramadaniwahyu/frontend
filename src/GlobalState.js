import React, {createContext, useState, useEffect} from 'react'
import axios from 'axios'

import AuthAPI from './api/AuthAPI'
import UserAPI from './api/UserAPI'
import AuthorAPI from './api/AuthorAPI'
import BookAPI from './api/BookAPI'
import CategoryAPI from './api/CategoryAPI'

export const GlobalState = createContext()


export const DataProvider = ({children}) =>{
    const [token, setToken] = useState(false)

    useEffect(() =>{
        const firstLogin = localStorage.getItem('firstLogin')
        if(firstLogin){
            const refreshToken = async () =>{
                const res = await axios.post('/api/refresh_token')
        
                setToken(res.data.accesstoken)                
    
                setTimeout(() => {
                    refreshToken()
                }, 10 * 60 * 1000)
            }
            refreshToken()
        }
    },[])

    const state = {
        token: [token, setToken],
        authAPI: AuthAPI(token),
        userAPI: UserAPI(token),
        authorAPI: AuthorAPI(token),
        bookAPI: BookAPI(token),
        categoryAPI: CategoryAPI(token)
    }

    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    )
}