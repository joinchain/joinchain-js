"use strict"

var cryp = require("crypto");
var scrypt = require("@web3-js/scrypt-shim");
var utils = require("web3-utils");
var uuid = require("uuid");
var Account = require('./account');
var _ = require("underscore");

var KeyStore = function KeyStore() {
    this.account = new Account();
}

/**
 * 私钥加密后形成keystore
 * 
 * @method encrypt
 * @param privateKey
 * @param password
 * @param options
 * @return 
 */
KeyStore.prototype.encrypt = function(privateKey, password, options) {
    /* jshint maxcomplexity: 20 */
    this.account.privateKeyToAccount(privateKey, true);
    options = options || {};
    var salt = options.salt || cryp.randomBytes(32);
    var iv = options.iv || cryp.randomBytes(16);

    var derivedKey;
    var kdf = options.kdf || 'pbkdf2';
    var kdfparams = {
        dklen: options.dklen || 32,
        salt: salt.toString('hex')
    };

    if (kdf === 'pbkdf2') {
        kdfparams.c = options.c || 262144;
        kdfparams.prf = 'hmac-sha256';
        derivedKey = cryp.pbkdf2Sync(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256');
    } else if (kdf === 'scrypt') {
        // FIXME: support progress reporting callback
        kdfparams.n = options.n || 8192; // 2048 4096 8192 16384
        kdfparams.r = options.r || 8;
        kdfparams.p = options.p || 1;
        // if (!this.browser) {
        //     derivedKey = this.deriveKeyUsingScryptInNode(password, salt, options);
        // }else {
        //     derivedKey = this.deriveKeyUsingScryptInBrowser(password, salt, options);
        // } 
        derivedKey = scrypt(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
    } else {
        throw new Error('Unsupported kdf');
    }

    var cipher = cryp.createCipheriv(options.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv);
    if (!cipher) {
        throw new Error('Unsupported cipher');
    }

    var ciphertext = Buffer.concat([cipher.update(Buffer.from(this.account.getPrivate(), 'hex')), cipher.final()]);

    var mac = utils.sha3(Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext, 'hex')])).replace('0x', '');

    return {
        version: 3,
        id: uuid.v4({random: options.uuid || cryp.randomBytes(16)}),
        address: this.account.getAddress().toLowerCase().replace('0x', ''),
        crypto: {
            ciphertext: ciphertext.toString('hex'),
            cipherparams: {
                iv: iv.toString('hex')
            },
            cipher: options.cipher || 'aes-128-ctr',
            kdf: kdf,
            kdfparams: kdfparams,
            mac: mac.toString('hex')
        }
    };
};

/**
 * keystore 转私钥
 * 
 * @method decrypt
 * @param v3Keystore
 * @param password
 * @param nonStrict
 * @return 
 */
KeyStore.prototype.decrypt = function(v3Keystore, password, nonStrict) {
    /* jshint maxcomplexity: 10 */

    if (!_.isString(password)) {
        throw new Error('No password given.');
    }

    var json = (_.isObject(v3Keystore)) ? v3Keystore : JSON.parse(nonStrict ? v3Keystore.toLowerCase() : v3Keystore);

    if (json.version !== 3) {
        throw new Error('Not a valid V3 wallet');
    }

    var derivedKey;
    var kdfparams;
    if (json.crypto.kdf === 'scrypt') {
        kdfparams = json.crypto.kdfparams;

        // FIXME: support progress reporting callback
        derivedKey = scrypt(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
    } else if (json.crypto.kdf === 'pbkdf2') {
        kdfparams = json.crypto.kdfparams;

        if (kdfparams.prf !== 'hmac-sha256') {
            throw new Error('Unsupported parameters to PBKDF2');
        }

        derivedKey = cryp.pbkdf2Sync(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256');
    } else {
        throw new Error('Unsupported key derivation scheme');
    }

    var ciphertext = Buffer.from(json.crypto.ciphertext, 'hex');

    var mac = utils.sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext])).replace('0x', '');
    if (mac !== json.crypto.mac) {
        throw new Error('Key derivation failed - possibly wrong password');
    }

    var decipher = cryp.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), Buffer.from(json.crypto.cipherparams.iv, 'hex'));
    var seed = '0x' + Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('hex');
    this.account.loadAccount(seed);
    return this.account.getPrivate(true);
};
module.exports = KeyStore;

// console.log("privateKey to keystore start---------------------- \n");
// var privateKey = "0x6978080e309918acef6df2f341b4e6b311f7846108d6ecfe983d6124aaf2370d";
// console.log("原privateKey为：" + privateKey + '\n');
// var pwd = "123456";
// var keyStore = new KeyStore();
// var str = keyStore.encrypt(privateKey,pwd);
// console.log("keystore 为 ：" + JSON.stringify(str) + '\n');
// console.log("privateKey to keystore end----------------------\n");

// console.log("----------------------------------------- \n");

// console.log("keystore to privateKey start---------------------- \n");
// var private1 = keyStore.decrypt(str,pwd);
// console.log("转换后privateKey 为 ：" + private1 + '\n');