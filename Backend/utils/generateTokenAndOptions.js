const jwt = require('jsonwebtoken');
require('dotenv').config('../.env');

const GenerateTokenAndOptions = (userID) => {
    let token = jwt.sign({ id: userID },
        process.env.SECRET_MESSAGE,
        { expiresIn: process.env.TOKEN_EXPIRY_DATE });

    const options = {
        expires: new Date(Date.now() + process.env.TOKEN_EXPIRY_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }

    return { token, options }
}

module.exports = GenerateTokenAndOptions;