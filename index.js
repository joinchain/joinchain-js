"use strict";
const ECDSA = require('ecdsa-secp256r1')

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

// 导出账号地址
function ExportAddress(jwk) {
    var key = ECDSA.fromJWK(jwk)
    var address = "0x" + key.toCompressedPublicKey("hex")
    console.log(address)
    return address;
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
    ExportPublic: ExportPublic,
    ExportAddress: ExportAddress,
    SignData: SignData,
    VerifyData, VerifyData
};