import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import jwtDecode from "jwt-decode";

const Register = ({ setUser, setIsLogged }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const getRegister = (e) => {
    e.preventDefault();
    const newUserData = credentials;
    axios
      .post("/user/register", newUserData)
      .then((resp) => {
        if (resp.status === 200) {
          navigate("/");
          setCredentials({
            username: "",
            email: "",
            password: "",
          });
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };
  return (
    <div id="container">
      <div id="introductionBox"></div>
      <div id="loginBox">
        <form action="" method="post" id="formBox" onSubmit={getRegister}>
          <h2 style={{ textAlign: "center" }}>Register</h2>
          <label htmlFor="username">Username*</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
          />
          <p id="emailErrorMessage" className="errorMessage"></p>
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
          />
          <p id="emailErrorMessage" className="errorMessage"></p>
          <label htmlFor="password">Password*</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
          />
          <p id="passwordErrorMessage" className="errorMessage"></p>
          <button id="loginBtn">Register</button>
          <p>
            Already our user?{" "}
            <Link to={"/"} className="linkClass">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
