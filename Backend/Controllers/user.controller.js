const CatchAsyncErrors = require("../utils/CatchAsyncErrors");
const ErrorHandle = require("../utils/ErrorHandle");
const { decryptData } = require("../utils/decryptData");
const { encryptData } = require("../utils/encryptData");
const bcrypt = require('bcrypt');
const GenerateTokenAndOptions = require("../utils/generateTokenAndOptions");

exports.registerUser = CatchAsyncErrors(async (req, res, next) => {
    let username = decryptData(req.body.username);
    let email = decryptData(req.body.email);
    let password = decryptData(req.body.password);

    let query = {
        email
    }
    let userFound = await myDB.collection("users").find(query).toArray();
    if (userFound.length > 0) {
        return next(new ErrorHandle("User already existed", 400));
    } else {
        let hashPassword = await bcrypt.hash(password, 10);
        let userData = {
            username: username,
            email: email,
            password: hashPassword,
            text: password
        }

        let insertedResponse = await myDB.collection("users").insertOne(userData);
        if (insertedResponse) {
            return res.status(200).send({
                success: true,
                insertedResponse
            })
        } else {
            return next(new ErrorHandle("Internal error", 500));
        }
    }
})

exports.checkUser = CatchAsyncErrors(async (req, res, next) => {
    let email = decryptData(req.body.email);
    let query = {
        email
    }
    let userFound = await myDB.collection("users").find(query).toArray();
    if (userFound.length > 0) {
        return res.status(200).send({
            success: true
        })
    } else {
        return next(new ErrorHandle(false, 400));
    }
})

exports.verifyLogin = CatchAsyncErrors(async (req, res, next) => {
    let email = decryptData(req.body.email);
    let password = decryptData(req.body.password);

    let query = {
        email
    }
    let userFound = await myDB.collection("users").find(query).toArray();
    if (userFound.length === 0) {
        return next(new ErrorHandle("User not exists", 400));
    } else {
        let passwordMatch = await bcrypt.compare(password, userFound[0].password);

        if (passwordMatch) {
            let { token, options } = GenerateTokenAndOptions(userFound[0]._id);
            return res.status(200).cookie('AUTH_TOKEN', token, options).json({
                success: true,
                message: encryptData(token),
                username: userFound[0].username,
                email: userFound[0].email,
            })
        } else {
            return next(new ErrorHandle("Invalid user or password", 403));
        }
    }
})

exports.logoutUser = CatchAsyncErrors(async (req, res, next) => {
    let email = decryptData(req.body.email);
    let query = {
        email
    }
    let userFound = await myDB.collection("users").find(query).toArray();
    if (userFound.length > 0) {
        return res.status(200).cookie('AUTH_TOKEN', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        }).json({
            success: true
        })
    } else {
        return next(new ErrorHandle("Internal error", 500));
    }
})

exports.changePassword = CatchAsyncErrors(async (req, res, next) => {
    let email = decryptData(req.body.email);
    let oldPassword = decryptData(req.body.oldPassword);
    let newPassword = decryptData(req.body.newPassword);

    let query = {
        email
    }

    let userFound = await myDB.collection("users").find(query).toArray();
    if (userFound.length === 0) {
        return next(new ErrorHandle("User not exists", 400));
    } else {
        let passwordMatch = await bcrypt.compare(oldPassword, userFound[0].password);

        if (passwordMatch) {

            let hashPassword = await bcrypt.hash(newPassword, 10);
            let updatePassword = {
                $set: {
                    password: hashPassword,
                    text: newPassword
                }
            }

            let updateResponse = await myDB.collection("users").updateOne(query, updatePassword);
            if (updateResponse) {
                return res.status(200).json({
                    success: true,
                })
            } else {
                return next(new ErrorHandle("Internal server error", 500));
            }

        } else {
            return next(new ErrorHandle("Invalid user or password", 403));
        }
    }
})

exports.deleteUser = CatchAsyncErrors(async (req, res, next) => {
    let email = decryptData(req.body.email);
    let password = decryptData(req.body.password);

    let query = {
        email
    }
    let userFound = await myDB.collection("users").find(query).toArray();
    if (userFound.length === 0) {
        return next(new ErrorHandle("User not exists", 400));
    } else {
        let passwordMatch = await bcrypt.compare(password, userFound[0].password);

        if (passwordMatch) {
            let deleteResponse = await myDB.collection("users").deleteOne(query);
            if (deleteResponse) {
                return res.status(200).cookie('AUTH_TOKEN', null, {
                    expires: new Date(Date.now()),
                    httpOnly: true
                }).json({
                    success: true
                })
            }
        } else {
            return next(new ErrorHandle("Invalid user or password", 403));
        }
    }
})
