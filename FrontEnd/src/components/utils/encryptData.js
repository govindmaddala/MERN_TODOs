import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";
const secretKey = process.env.REACT_APP_SECRET_KEY;


const encryptData = (dataToEncrypt) => {
    let encryptedData = CryptoJS.AES.encrypt(
        dataToEncrypt,
        secretKey
    ).toString();

    const base64EncodedData = Base64.encodeURI(encodeURIComponent(encryptedData));
    return base64EncodedData;
}

export default encryptData;