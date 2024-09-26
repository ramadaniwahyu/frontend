import { useState, useEffect } from 'react'
import axios from 'axios'

function UserAPI(token) {
    const [data, setData] = useState([])
    const [callback, setCallback] = useState(false)

    useEffect(() => {
        if (token) {
            const getUsers = async () => {
                const res = await axios.get('/api/users', {
                    headers: { Authorization: token }
                })
                setData(res.data.result)
            }
            getUsers()
        }
    }, [token, data, callback])

    return {
        data: [data, setData],
        callback: [callback, setCallback]
    }
}

export default UserAPI
