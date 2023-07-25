require('dotenv').config('../.env');
const { Base64 } = require("js-base64");
const CryptoJS = require("crypto-js");
const secretKey = process.env.SECRET_KEY;

exports.decryptData = (url) => {
    const base64URLEncoded = url;
    const base64URLDecoded = Base64.decode(base64URLEncoded);
    const encryptedEndpoint = decodeURIComponent(base64URLDecoded);
    const decryptedEndpoint = CryptoJS.AES.decrypt(encryptedEndpoint, secretKey).toString(CryptoJS.enc.Utf8);
    return decryptedEndpoint;
}
