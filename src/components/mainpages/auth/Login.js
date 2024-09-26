import axios from 'axios';
import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image'

function Login() {
    const [user, setUser] = useState({
        email: '', password: ''
    })

    const onChangeInput = e => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })
    }

    const loginSubmit = async e => {
        e.preventDefault()
        try {
            await axios.post('/api/login', { ...user })

            localStorage.setItem('firstLogin', true)

            window.location.href = "/";
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    return (
        <div className="card">
            <div className="">
                <div className='w-full flex flex-column align-items-center justify-content-center gap-3 py-5 mt-6'>
                    <Image alt="logo" src="/logo.png" height="40" className="mr-2" />
                    <span className='text-3xl font-bold tracking-tight text-gray-900'>Latihan App</ span>
                </div>
                <form onSubmit={loginSubmit} className='w-full flex flex-column align-items-center justify-content-center gap-3 py-5'>
                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">Username</label>
                        <InputText id="email" type="email" name="email" className="w-12rem" value={user.email} onChange={onChangeInput}/>
                    </div>
                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">Password</label>
                        <InputText id="password" name="password" type="password" className="w-12rem" value={user.password} onChange={onChangeInput} autoComplete='current-password'/>
                    </div>
                    <Button label="Login" type="submit" icon="pi pi-user" className="w-10rem mx-auto"></Button>
                </form>
            </div>
        </div>
    )
}

export default Login
