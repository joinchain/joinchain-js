/**
 * Create, import, and export joinchain keys.
 * @author YinSong (yinsong@joinchain.io)
 * @author SunFeng (sunfeng@joinchain.io)
 */

"use strict";
var keccak256 = require('keccak256')
var crypto = require("crypto");
var uuid = require("uuid");
/*
* joinchain.keystore 是joinchain的存储账号的nodejs接口。该接口提供账号的加密功能，类似ethereum的keystore
*/

/**
 * 相当于定义类并且可以实现构造函数
 */
var Keystore = function Keystore() {
  //var _this = this;
}

/**
 * 通过私钥生成 Keystore
 *
 * @method importKeystore
 * @param 
 * @return 
 */
Keystore.importKeystore = function (privateKey, params) {
  var randomBytes = crypto.randomBytes(params.keyBytes + params.ivBytes + params.keyBytes);
  return {
    privateKey: privateKey,
    iv: randomBytes.slice(params.keyBytes, params.keyBytes + params.ivBytes),
    salt: randomBytes.slice(params.keyBytes + params.ivBytes)
  }
}

/**
 * Check whether a string is valid hex.
 * @param {string} str String to validate.
 * @return {boolean} True if the string is valid hex, false otherwise.
 */
Keystore.isHex = function (str) {
  if (str.length % 2 === 0 && str.match(/^[0-9a-f]+$/i)) return true;
  return false;
}

/**
 * Check whether a string is valid base-64.
 * @param {string} str String to validate.
 * @return {boolean} True if the string is valid base-64, false otherwise.
 */
Keystore.isBase64 = function (str) {
  var index;
  if (str.length % 4 > 0 || str.match(/[^0-9a-z+\/=]/i)) return false;
  index = str.indexOf("=");
  if (index === -1 || str.slice(index).match(/={1,2}/)) return true;
  return false;
}

/**
 * Convert a string to a Buffer.  If encoding is not specified, hex-encoding
 * will be used if the input is valid hex.  If the input is valid base64 but
 * not valid hex, base64 will be used.  Otherwise, utf8 will be used.
 * @param {string} str String to be converted.
 * @param {string=} enc Encoding of the input string (optional).
 * @return {buffer} Buffer (bytearray) containing the input data.
 */
Keystore.str2buf = function (str, enc) {
  if (!str || str.constructor !== String) return str;
  if (!enc && this.isHex(str)) enc = "hex";
  if (!enc && this.isBase64(str)) enc = "base64";
  return Buffer.from(str, enc);
}

/**
   * Derive secret key from password with key dervation function.
   * @param {string|buffer} password User-supplied password.
   * @param {string|buffer} salt Randomly generated salt.
   * @param {Object=} options Encryption parameters.
   * @param {string=} options.kdf Key derivation function (default: pbkdf2).
   * @param {string=} options.cipher Symmetric cipher (default: constants.cipher).
   * @param {Object=} options.kdfparams KDF parameters (default: constants.<kdf>).
   * @return {buffer} Secret key derived from password.
   */
Keystore.deriveKey = function (password, salt, options) {
  var prf, self = this;
  if (typeof password === "undefined" || password === null || !salt) {
    throw new Error("Must provide password and salt to derive a key");
  }
  options = options || {};
  options.kdfparams = options.kdfparams || {};

  // convert strings to buffers
  password = this.str2buf(password, "utf8");
  salt = this.str2buf(salt);

  // use scrypt as key derivation function
  if (options.kdf === "scrypt") {
    if (!this.browser) return this.deriveKeyUsingScryptInNode(password, salt, options);
    return this.deriveKeyUsingScryptInBrowser(password, salt, options);
  }

  // use default key derivation function (PBKDF2)
  console.log(options)
  prf = options.kdfparams.prf || this.constants.pbkdf2.prf;
  if (prf === "hmac-sha256") prf = "sha256";
    if (!crypto.pbkdf2Sync) {
      return Buffer.from(sjcl.codec.hex.fromBits(sjcl.misc.pbkdf2(
        password.toString("utf8"),
        sjcl.codec.hex.toBits(salt.toString("hex")),
        options.kdfparams.c || self.constants.pbkdf2.c,
        (options.kdfparams.dklen || self.constants.pbkdf2.dklen) * 8
      )), "hex");
    }
    return crypto.pbkdf2Sync(
      password,
      salt,
      options.kdfparams.c || this.constants.pbkdf2.c,
      options.kdfparams.dklen || this.constants.pbkdf2.dklen,
      prf
    );
}

/**
 * Check if the selected cipher is available.
 * @param {string} algo Encryption algorithm.
 * @return {boolean} If available true, otherwise false.
 */
Keystore.isCipherAvailable = function (cipher) {
  return crypto.getCiphers().some(function (name) { return name === cipher; });
}

/**
 * Symmetric private key encryption using secret (derived) key.
 * @param {buffer|string} plaintext Data to be encrypted.
 * @param {buffer|string} key Secret key.
 * @param {buffer|string} iv Initialization vector.
 * @param {string=} algo Encryption algorithm (default: constants.cipher).
 * @return {buffer} Encrypted data.
 */
Keystore.encrypt = function (plaintext, key, iv, algo) {
  var cipher, ciphertext;
  algo = algo || this.constants.cipher;
  if (!this.isCipherAvailable(algo)) throw new Error(algo + " is not available");
  cipher = crypto.createCipheriv(algo, this.str2buf(key), this.str2buf(iv));
  ciphertext = cipher.update(this.str2buf(plaintext));
  return Buffer.concat([ciphertext, cipher.final()]);
}

/**
 * Symmetric private key decryption using secret (derived) key.
 * @param {buffer|string} ciphertext Data to be decrypted.
 * @param {buffer|string} key Secret key.
 * @param {buffer|string} iv Initialization vector.
 * @param {string=} algo Encryption algorithm (default: constants.cipher).
 * @return {buffer} Decrypted data.
 */
Keystore.decrypt = function (ciphertext, key, iv, algo) {
  var decipher, plaintext;
  algo = algo || this.constants.cipher;
  if (!this.isCipherAvailable(algo)) throw new Error(algo + " is not available");
  decipher = crypto.createDecipheriv(algo, this.str2buf(key), this.str2buf(iv));
  plaintext = decipher.update(this.str2buf(ciphertext));
  return Buffer.concat([plaintext, decipher.final()]);
}

/**
 * Calculate message authentication code from secret (derived) key and
 * encrypted text.  The MAC is the keccak-256 hash of the byte array
 * formed by concatenating the second 16 bytes of the derived key with
 * the ciphertext key's contents.
 * @param {buffer|string} derivedKey Secret key derived from password.
 * @param {buffer|string} ciphertext Text encrypted with secret key.
 * @return {string} Hex-encoded MAC.
 */
Keystore.getMAC = function (derivedKey, ciphertext) {
  if (derivedKey !== undefined && derivedKey !== null && ciphertext !== undefined && ciphertext !== null) {
    return keccak256(Buffer.concat([
      this.str2buf(derivedKey).slice(16, 32),
      this.str2buf(ciphertext)
    ])).toString("hex");
  }
}

/**
 * Derive Ethereum address from private key.
 * @param {buffer|string} privateKey ECDSA private key.
 * @return {string} Hex-encoded Ethereum address.
 */
Keystore.privateKeyToAddress = function (privateKey) {
  var privateKeyBuffer, publicKey;
  privateKeyBuffer = this.str2buf(privateKey);
  if (privateKeyBuffer.length < 32) {
    privateKeyBuffer = Buffer.concat([
      Buffer.alloc(32 - privateKeyBuffer.length, 0),
      privateKeyBuffer
    ]);
  }
  // 尝试导入私钥buffer数据的方式创建私钥
  var P256 = crypto.createECDH("prime256v1")
  P256.setPrivateKey(privateKeyBuffer)
  publicKey = P256.getPublicKey().slice(1);
  return "0x" + keccak256(publicKey).slice(-20).toString("hex");
}

/**
 * Assemble key data object in secret-storage format.
 * @param {buffer} derivedKey Password-derived secret key.
 * @param {buffer} privateKey Private key.
 * @param {buffer} salt Randomly generated salt.
 * @param {buffer} iv Initialization vector.
 * @param {Object=} options Encryption parameters.
 * @param {string=} options.kdf Key derivation function (default: pbkdf2).
 * @param {string=} options.cipher Symmetric cipher (default: constants.cipher).
 * @param {Object=} options.kdfparams KDF parameters (default: constants.<kdf>).
 * @return {Object}
 */
Keystore.marshal = function (derivedKey, privateKey, salt, iv, options) {
  var ciphertext, keyObject, algo;
  options = options || {};
  options.kdfparams = options.kdfparams || {};
  algo = options.cipher || this.constants.cipher;

  // encrypt using first 16 bytes of derived key
  ciphertext = this.encrypt(privateKey, derivedKey.slice(0, 16), iv, algo).toString("hex");

  keyObject = {
    address: this.privateKeyToAddress(privateKey).slice(2),
    crypto: {
      cipher: options.cipher || this.constants.cipher,
      ciphertext: ciphertext,
      cipherparams: { iv: iv.toString("hex") },
      mac: this.getMAC(derivedKey, ciphertext)
    },
    id: uuid.v4(), // random 128-bit UUID
    version: 3
  };

  if (options.kdf === "scrypt") {
    keyObject.crypto.kdf = "scrypt";
    keyObject.crypto.kdfparams = {
      dklen: options.kdfparams.dklen || this.constants.scrypt.dklen,
      n: options.kdfparams.n || this.constants.scrypt.n,
      r: options.kdfparams.r || this.constants.scrypt.r,
      p: options.kdfparams.p || this.constants.scrypt.p,
      salt: salt.toString("hex")
    };
  } else {
    keyObject.crypto.kdf = "pbkdf2";
    keyObject.crypto.kdfparams = {
      c: options.kdfparams.c || this.constants.pbkdf2.c,
      dklen: options.kdfparams.dklen || this.constants.pbkdf2.dklen,
      prf: options.kdfparams.prf || this.constants.pbkdf2.prf,
      salt: salt.toString("hex")
    };
  }

  return keyObject;
}

/**
 * Export private key to keystore secret-storage format.
 * @param {string|buffer} password User-supplied password.
 * @param {string|buffer} privateKey Private key.
 * @param {string|buffer} salt Randomly generated salt.
 * @param {string|buffer} iv Initialization vector.
 * @param {Object=} options Encryption parameters.
 * @param {string=} options.kdf Key derivation function (default: pbkdf2).
 * @param {string=} options.cipher Symmetric cipher (default: constants.cipher).
 * @param {Object=} options.kdfparams KDF parameters (default: constants.<kdf>).
 * @return {Object}
 */
Keystore.dump = function (password, privateKey, salt, iv, options) {
  options = options || {};
  iv = this.str2buf(iv);
  privateKey = this.str2buf(privateKey);

  return this.marshal(this.deriveKey(password, salt, options), privateKey, salt, iv, options);
}

/**
 * Recover plaintext private key from secret-storage key object.
 * @param {Object} keyObject Keystore object.
 * @return {buffer} Plaintext private key.
 */
Keystore.recover = function (password, keyObject) {
  var keyObjectCrypto, iv, salt, ciphertext, algo, self = this;
  keyObjectCrypto = keyObject.Crypto || keyObject.crypto;

  // verify that message authentication codes match, then decrypt
  function verifyAndDecrypt(derivedKey, salt, iv, ciphertext, algo) {
    var key;
    if (self.getMAC(derivedKey, ciphertext) !== keyObjectCrypto.mac) {
      throw new Error("message authentication code mismatch");
    }
    if (keyObject.version === "1") {
      key = keccak256(derivedKey.slice(0, 16)).slice(0, 16);
    } else {
      key = derivedKey.slice(0, 16);
    }
    return self.decrypt(ciphertext, key, iv, algo);
  }

  iv = this.str2buf(keyObjectCrypto.cipherparams.iv);
  salt = this.str2buf(keyObjectCrypto.kdfparams.salt);
  ciphertext = this.str2buf(keyObjectCrypto.ciphertext);
  algo = keyObjectCrypto.cipher;

  if (keyObjectCrypto.kdf === "pbkdf2" && keyObjectCrypto.kdfparams.prf !== "hmac-sha256") {
    throw new Error("PBKDF2 only supported with HMAC-SHA256");
  }

  // derive secret key from password
  return verifyAndDecrypt(this.deriveKey(password, salt, keyObjectCrypto), salt, iv, ciphertext, algo);
}

// Exports
module.exports = {
  Keystore:Keystore
};

// *** 以下是测试代码 ***
// Example Code
var k = Keystore
// keystore的参数
const params = { keyBytes: 32, ivBytes: 16 };
// 加密算法设置
const options = {
  kdf: "pbkdf2",
  cipher: "aes-128-ctr",
  kdfparams: {
    c: 262144,
    dklen: 32,
    prf: "hmac-sha256"
  }
};
// 密码
var password = "123"
// 从私钥导入新的keystore
var keyBuffer = Buffer.from("ef6ec597f2727d88dff3c703c2537bec5e422dab4a728889f04ff14a58d590f6", "hex")
var s = k.importKeystore(keyBuffer, params);
console.log(s)

// 从 keystore 导出存储对象
var d = k.dump(password, keyBuffer, s.salt, s.iv, options)
console.log("keystore:", d)
// 从存储对象导出 json 字符串
var j = JSON.stringify(d)
console.log("json:", j)

// 通过 json 字符串恢复 Keystore
var r = Keystore
var keyObject = JSON.parse(j)
// 恢复私钥数据
var privateKey = r.recover(password, keyObject);

// 对比私钥数据
console.log("New Key:", privateKey.toString("hex"))
console.log("Old Key:", keyBuffer.toString("hex"))