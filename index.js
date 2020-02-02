"use strict";
const ECDSA = require('ecdsa-secp256r1')
const keccak256 = require('keccak256')

/*
* joinchain-account 是joinchain的账号nodejs接口。该接口提供账号的生成、加载功能
* 目前暂时没有账号的加密功能，后期在功能测试完成后，会追加账号的加密功能，类似ethereum的keystore
*/

// 创建新的账号
function NewAccount() {
    const privateKey = ECDSA.generateKey()
    return privateKey.toJWK()
}

// 加载账号
function LoadAccount(jwk) {
    var key = ECDSA.fromJWK(jwk)
    return key;
}

// 导出公钥
function ExportPublic(jwk) {
    var key = ECDSA.fromJWK(jwk)
    if(key.isPrivate){
        var publicKey = key.asPublic();
        return publicKey.toJWK();
    }
    return null;
}

// 获取私钥数据
function GetPrivate(jwk) {
    var key = ECDSA.fromJWK(jwk)
    if(!key.isPrivate){
        throw new Error('need a private key.');
    }
    return "0x" + key.d.toString("hex")
}

// 获取公钥数据
function GetPublic(jwk) {
    var key = ECDSA.fromJWK(jwk)
    var buffer = Buffer.concat([key.x,key.y]);
    return "0x"+buffer.toString("hex")
}

// 导出账号地址
function GetAddress(jwk) {
    var key = ECDSA.fromJWK(jwk)
    var buffer = Buffer.concat([key.x,key.y]);
    if (!Buffer.isBuffer(buffer)) {
      throw new Error('this key must be a buffer object in order to get public key address');
    }
    return "0x" + keccak256(buffer).slice(12).toString('hex');
}

// 签名数据
function SignData(data, privateKey) {
    const signature = privateKey.sign(data);
    return signature;
}

// 验证签名数据
function VerifyData(data, signature, publicKey) {
    return publicKey.verify(data, signature)
}

module.exports = {
    NewAccount: NewAccount,
    LoadAccount: LoadAccount,
    GetPrivate: GetPrivate,
    GetPublic: GetPublic,
    GetAddress: GetAddress,
    SignData: SignData,
    VerifyData, VerifyData
};