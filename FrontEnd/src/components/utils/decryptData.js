import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";
const secretKey = process.env.REACT_APP_SECRET_KEY;

const decryptData = (data) => {
    const base64URLEncoded = data;
    const base64URLDecoded = Base64.decode(base64URLEncoded);
    const encryptedEndpoint = decodeURIComponent(base64URLDecoded);
    const decryptedEndpoint = CryptoJS.AES.decrypt(encryptedEndpoint, secretKey).toString(CryptoJS.enc.Utf8);
    return decryptedEndpoint;
}

export default decryptData;
