import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import decodeToken from 'jwt-decode';

import Index from './components/Authentication'
import Register from './components/Authentication/Register';

import Home from './components/Tasks/Home'
import axios from 'axios';
import UserNotFound from './components/UserNotFound';

const App = () => {

    const [user, setUser] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        var token = localStorage.getItem("AUTH_TOKEN");
        if (token) {
            var decodedUser = decodeToken(token);
            axios.get(`/user/${decodedUser.id}`).then((resp) => {
                if (resp.status === 200) {
                    setUser(decodedUser);
                    setIsLogged(true);
                }
            })
        } else {
            setUser(false);
            setIsLogged(false);
        }
    }, []);
    const logoutFunction = () => {
        setUser(false);
        setIsLogged(false);
        localStorage.removeItem("AUTH_TOKEN");
    }
    return (
        // <Router>
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Index setUser={setUser} setIsLogged={setIsLogged} />} />
            <Route path="/home" element={<Home isLogged={isLogged} user={user} setUser={setUser} setIsLogged={setIsLogged} logoutFunction={logoutFunction} />} />
            <Route path="*" element={<UserNotFound />} />
        </Routes>
        // </Router>
    )
}
export default App
