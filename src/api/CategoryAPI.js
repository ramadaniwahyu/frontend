import { useState, useEffect } from 'react'
import axios from 'axios'

function CategoryAPI(token) {
    const [data, setData] = useState([])
    const [callback, setCallback] = useState(false)

    useEffect(() => {
        if (token){
            const getData = async () => {
                const res = await axios.get('/api/category', {
                    headers: { Authorization: token }
                })
                setData(res.data)
                // console.log(res.data);
            }
            getData()
        }
    }, [token, callback, data])

    return {
        data: [data, setData],
        callback: [callback, setCallback]
    }
}

export default CategoryAPI