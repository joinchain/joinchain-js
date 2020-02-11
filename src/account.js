"use strict";

var crypto = require("crypto");
var keccak256 = require('keccak256');
var asn1 = require('asn1.js');
var BN = require('bn.js');

const curveLength = Math.ceil(256 / 8) /* Byte length for validation */

/**
 * 相当于定义类并且可以实现构造函数
 */
var Account = function Account(cryptoName = "prime256v1") {
    // 显示所有支持的算法
    this.cryptoName = cryptoName;
    this.ecdh = crypto.createECDH(cryptoName)
    this.publicCodePoint = this.x = this.y = 0
}

/**
 * 创建账号
 *
 * @method newAccount
 * @param 
 * @return 
 */
Account.prototype.newAccount = function() {
     if(!this.ecdh) {
         throw new Error('crypto not createECDH');
     }
     this.ecdh.generateKeys();
     return this.initKey();
}

//初始化
Account.prototype.initKey = function(){
    this.x = this.ecdh.getPublicKey().slice(1, curveLength + 1);
    this.y = this.ecdh.getPublicKey().slice(curveLength + 1);
    this.publicCodePoint = Buffer.concat([Buffer.from([0x04]), this.x, this.y])
    this.p = this.ecdh.getPrivateKey();
    return this.ecdh;
}

/**
 * 加载账号
 * 
 * @method loadAccount
 * @param privateKey
 * @return 
 */
Account.prototype.loadAccount = function(privateKey) {
   if(!this.ecdh) {
        throw new Error('crypto not createECDH');
   }
   if(!privateKey){
    throw new Error('export a private key is null.');
   }
   //如果包含0x则去除
   if(privateKey.substring(0, 2) == "0x") {
     privateKey = privateKey.substring(2);
   }
   //设置对象
   this.ecdh.setPrivateKey(privateKey,"hex")
   return this.initKey();
}
/**
 * 获取私钥数据
 * 
 * @method getPrivate
 * @param  prefix
 * @return 
 */
Account.prototype.getPrivate = function(prefix = false) {
    if(!this.ecdh) {
        throw new Error('crypto not createECDH');
    }
    var privateKey =  this.ecdh.getPrivateKey().toString("hex");
    if(!privateKey){
        throw new Error('create a private key faild.');
    }
    if(!prefix){
        return privateKey;
    }
    return "0x" + privateKey;
}

/**
 * 获取公钥数据
 * 
 * @method getPublic
 * @param prefix
 * @return 
 */
Account.prototype.getPublic = function(prefix = false) {
    if(!this.ecdh) {
        throw new Error('crypto not createECDH');
    }
    var publicKey = this.ecdh.getPublicKey().toString("hex");
    if(!publicKey) {
        throw new Error('create a public key faild.');
    }
    if(!prefix){
        return publicKey;
    }
    return "0x" + publicKey;
}

Account.prototype.fromCompressedPublicKey = function (compressedKey, format = 'base64') {
    const key = crypto.ECDH.convertKey(compressedKey, this.cryptoName, format, 'base64', 'uncompressed')
    const keyBuffer = Buffer.from(key, 'base64')
    this.x = keyBuffer.slice(1, curveLength + 1);
    this.y = keyBuffer.slice(curveLength + 1)
    return this.ecdh;
  }

  Account.prototype.toCompressedPublicKey = function(format = 'base64') {
    return crypto.ECDH.convertKey(this.publicCodePoint, this.cryptoName, 'base64', format, 'compressed')
  }

/**
 * 导出账号地址
 * 
 * @method getAddress
 * @param 
 * @return 
 */
Account.prototype.getAddress = function() {
    if(!this.ecdh) {
        throw new Error('crypto not createECDH');
    }
    var buffer = Buffer.concat([this.x,this.y]);
    if (!Buffer.isBuffer(buffer)) {
        throw new Error('this key must be a buffer object in order to get public key address');
    }
    return "0x" + keccak256(buffer).slice(12).toString('hex')
    // var publicKey = this.ecdh.getPublicKey()
    // if(!publicKey) {
    //     throw new Error('create a public key faild.');
    // }
    
    // return "0x" + keccak256(publicKey).slice(12).toString('hex');
}

Account.prototype.privateKeyToAccount = function(privateKey, ignoreLength) {
    if (!privateKey.startsWith('0x')) {
        privateKey = '0x' + privateKey;
    }

    // 64 hex characters + hex-prefix
    if (!ignoreLength && privateKey.length !== 66) {
        throw new Error("Private key must be 32 bytes long");
    }

    return this.loadAccount(privateKey);
};


module.exports = Account;