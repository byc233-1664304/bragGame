var CryptoJS = require('crypto-js');

//the secret key used for encrypting and decrypting messages
var secret_key = process.env.REACT_APP_SECRET_KEY;

//returns the encrypted text
export const to_Encrypt = (text) => {
  var encrypted = CryptoJS.AES.encrypt(text, secret_key).toString();
  return encrypted;
};

//welcome message is not decrypted
export const to_Decrypt = (cipher, isCipher) => {
  if(isCipher) {
    //decryped message is returned
    var decrypted = CryptoJS.AES.decrypt(cipher, secret_key).toString(CryptoJS.enc.Utf8);
    return decrypted;
  }else {
    return cipher;
  }
};