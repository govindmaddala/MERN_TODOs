import React from "react";
import { Watermark } from "antd";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/Auth/LoginPage";
import RegistrationPage from "./components/Auth/RegistrationPage";
import HomePage from "./components/Tasks/HomePage";
import UserDetails from "./components/Auth/UserDetails";

const App = () => {
    return (
        <Watermark content="My_Notes">
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/user" element={<UserDetails />} />
            </Routes>
        </Watermark>
    );
};
export default App;
