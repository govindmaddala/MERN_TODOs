import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import decodeToken from 'jwt-decode';

import Index from './components/Authentication'

import Home from './components/Tasks/Home'
import axios from 'axios';

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
    }, [])

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Index setUser={setUser} setIsLogged={setIsLogged} />} />
                <Route path="/home" element={<Home isLogged={isLogged} user={user} setUser={setUser} setIsLogged={setIsLogged} />} />
            </Routes>
        </Router>
    )
}

export default App
