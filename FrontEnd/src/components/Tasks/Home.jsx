import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Index from "../Authentication";
import Navbar from "./Navbar";
import decodeToken from 'jwt-decode'
import axios from "axios";

const Home = ({ isLogged,setIsLogged,setUser}) => {
  const navigate = useNavigate();

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
        navigate('/')
    }
}, [setUser,setIsLogged,navigate])

  return isLogged ? (
    <>
      <Navbar />
    </>
  ) : (
    <>
      
    </>
  );
};

export default Home;
