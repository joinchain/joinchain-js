/**
 * Create, import, and export joinchain keys.
 * @author YinSong (yinsong@joinchain.io)
 * @author SunFeng (sunfeng@joinchain.io)
 */

"use strict";
var ECDSA = require('ecdsa-secp256r1')
var keccak256 = require('keccak256')

/*
* joinchain-account 是joinchain的账号nodejs接口。该接口提供账号的生成、加载功能
* 目前暂时没有账号的加密功能，后期在功能测试完成后，会追加账号的加密功能，类似ethereum的keystore
*/

/**
 * 相当于定义类并且可以实现构造函数
 */
var Account = function Account() {
    //var _this = this;
}
/**
 * 创建账号
 *
 * @method newAccount
 * @param 
 * @return 
 */
Account.newAccount = function() {
    var privateKey = ECDSA.generateKey()
    return privateKey.toJWK()
}
/**
 * 加载账号
 * 
 * @method loadAccount
 * @param jwk
 * @return 
 */
Account.loadAccount = function(jwk) {
    var key = ECDSA.fromJWK(jwk)
    return key;
}

/**
 * 导出私钥
 * 
 * @method loadAccount
 * @param 
 * @return 
 */
Account.exportPublic = function(jwk) {
    var key = ECDSA.fromJWK(jwk)
    if(key.isPrivate){
        var publicKey = key.asPublic();
        return publicKey.toJWK();
    }
    return null;
}

/**
 * 获取私钥数据
 * 
 * @method getPrivate
 * @param 
 * @return 
 */
Account.getPrivate = function(jwk) {
    var key = ECDSA.fromJWK(jwk)
    if(!key.isPrivate){
        throw new Error('need a private key.');
    }
    return "0x" + key.d.toString("hex")
}

/**
 * 获取公钥数据
 * 
 * @method getPublic
 * @param jwk
 * @return 
 */
Account.getPublic = function(jwk) {
    var key = ECDSA.fromJWK(jwk)
    var buffer = Buffer.concat([key.x,key.y]);
    return "0x"+buffer.toString("hex")
}

/**
 * 导出账号地址
 * 
 * @method getAddress
 * @param jwk
 * @return 
 */
Account.getAddress = function(jwk) {
    var key = ECDSA.fromJWK(jwk)
    var buffer = Buffer.concat([key.x,key.y]);
    if (!Buffer.isBuffer(buffer)) {
      throw new Error('this key must be a buffer object in order to get public key address');
    }
    return "0x" + keccak256(buffer).slice(12).toString('hex');
}

/**
 * 签名数据
 * 
 * @method signData
 * @param data
 * @param privateKey
 * @return 
 */
Account.signData = function(data, privateKey) {
    var signature = privateKey.sign(data);
    return signature;
}

/**
 * 验证签名数据
 * 
 * @method signData
 * @param data
 * @param signature
 * @param publicKey
 * @return 
 */
Account.verifyData = function(data, signature, publicKey) {
    return publicKey.verify(data, signature);
}

module.exports = {
    Account:Account
};