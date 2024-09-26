import Authors from './authors/Authors'
import Books from './books/Books'
import Categories from './categories/Categories'
import Dashboard from './dashboard/Dashboard'
import Login from './auth/Login'
import NotFound from './utils/not_found/NotFound'
import Home from './home/Home'
import Users from './users/Users'
import { useContext } from 'react'
import { GlobalState } from '../../GlobalState'
import { Routes, Route } from "react-router-dom";

function Pages() {
    const state = useContext(GlobalState)
    const [isLogged] = state.authAPI.isLogged
    const [isAdmin] = state.authAPI.isAdmin

    return (
        <Routes>
            <Route path="/" exact element={isLogged ? <Dashboard /> : <Home />} />
            <Route path="/authors" exact element={<Authors />} />
            <Route path="/books" exact element={<Books />} />
            <Route path="/categories" exact element={<Categories />} />

            <Route path="/login" exact element={isLogged ? <Dashboard /> : <Login />} />

            <Route path="/users" exact element={isAdmin ? <Users /> : <Login />} />

            <Route path="*" exact element={<NotFound />} />
        </Routes>
    )
}

export default Pages