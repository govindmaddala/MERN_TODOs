const express = require("express");
const router = express.Router();
const { decryptData } = require("../utils/decryptData");
const User = require("../Controllers/user.controller");

router.post("/:base64URL", (req, res, next) => {
    let decryptedEndpoint = decryptData(req.params.base64URL);
    if (decryptedEndpoint === "/verifyLogin") {
        User.verifyLogin(req, res, next)
    }

    if (decryptedEndpoint === "/registerUser") {
        User.registerUser(req, res, next)
    }

    if (decryptedEndpoint === "/logoutUser") {
        User.logoutUser(req, res, next)
    }

    if (decryptedEndpoint === "/checkUser") {
        User.checkUser(req, res, next)
    }


})

module.exports = router;