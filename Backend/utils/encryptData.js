require('dotenv').config('../.env');
const { Base64 } = require("js-base64");
const CryptoJS = require("crypto-js");
const secretKey = process.env.SECRET_KEY;


exports.encryptData = (dataToEncrypt) => {
    let encryptedData = CryptoJS.AES.encrypt(
        dataToEncrypt,
        secretKey
    ).toString();

    const base64EncodedData = Base64.encodeURI(encodeURIComponent(encryptedData));
    return base64EncodedData;
}
