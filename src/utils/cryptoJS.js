const CryptoJS = require("crypto-js");
const aseKey = "eer12kl0495jfk02"     //8/16/32

console.log('CryptoJS', CryptoJS)

export const encrypt = (message) => {
    return CryptoJS.AES.encrypt(message, aseKey).toString()
};

export const decrypt = (str) => {
    return CryptoJS.AES.decrypt(str, aseKey).toString(CryptoJS.enc.Utf8);
}

