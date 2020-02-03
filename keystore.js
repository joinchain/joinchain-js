/**
 * Create, import, and export joinchain keys.
 * @author YinSong (yinsong@joinchain.io)
 * @author SunFeng (sunfeng@joinchain.io)
 */

"use strict";
var keccak256 = require('keccak256')
var crypto = require("crypto");
/*
* joinchain.keystore 是joinchain的存储账号的nodejs接口。该接口提供账号的加密功能，类似ethereum的keystore
*/

var options = {
    kdf: "pbkdf2",
    cipher: "aes-128-ctr",
    kdfparams: {
      c: 262144,
      dklen: 32,
      prf: "hmac-sha256"
    }
  };
/**
 * 相当于定义类并且可以实现构造函数
 */
var Keystore = function Keystore() {
    //var _this = this;
}
/**
 * 通过私钥生成 Keystore
 *
 * @method newKeystore
 * @param 
 * @return 
 */
Keystore.newKeystore = function(privateKey, params) {
    var randomBytes = crypto.randomBytes(params.keyBytes + params.ivBytes + params.keyBytes);
    return {
        privateKey: privateKey,
        iv: randomBytes.slice(params.keyBytes, params.keyBytes + params.ivBytes),
        salt: randomBytes.slice(params.keyBytes + params.ivBytes)
      }
}

var k = Keystore
var params = { keyBytes: 32, ivBytes: 16 };
var s = k.newKeystore(Buffer.from("94c4d5627492aeee8a5a1d07fb0d3c00dbacae25aa21406ea82d8277ffe37f84", "hex"), params);
console.log(s)