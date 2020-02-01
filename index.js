"use strict";
var crypto = require('crypto');
const ECDHCrypto = require('ecdh-crypto');

/*
* joinchain-account 是joinchain的账号nodejs接口。该接口提供账号的生成、加载功能
* 目前暂时没有账号的加密功能，后期在功能测试完成后，会追加账号的加密功能，类似ethereum的keystore
*/

// 创建新的账号
function NewAccount() {
    // 使用 crypto 模块创建的p256
    // const { privateKey, publicKey } = crypto.generateKeyPairSync('ec',
    //     {
    //         namedCurve: 'P-256',
    //         publicKeyEncoding: {
    //             type: 'spki',
    //             format: 'pem'
    //         },
    //         privateKeyEncoding: {
    //             type: 'pkcs8',
    //             format: 'pem'
    //         }
    //     }
    // );
    //var key = new ECDHCrypto(privateKey, 'pem');
    
    // 使用 Ecdh-crypto 创建的p256
    // Create a new (random) ECDHCrypto instance using the secp521r1 curve
    var key = ECDHCrypto.createECDHCrypto('P-256');
    return JSON.stringify(key, null, 2);
}

// 加载账号
function LoadAccount(json) {
    var key = new ECDHCrypto(JSON.parse(json));
    return key;
}

// 签名数据
function SignData(data, privateKey) {
    var signature = privateKey.createSign('SHA256')
                   .update(data)
                   .sign('base64');
    return signature;
}

// 验证签名数据
function VerifyData(data, signature, publicKey) {
    return publicKey.createVerify('SHA256')
        .update(data)
        .verify(signature, 'base64');
}

// 签名，采用 crypto 模块
function SignData_crypto(data, privateKey) {
    const sign = crypto.createSign('SHA256');

    sign.write(data);
    sign.end();

    const signature = sign.sign(privateKey, 'hex');
    console.log(signature);
    return signature;
}

// 验证签名，采用 crypto 模块
function VerifyData_crypto(data, publicKey) {
    const verify = crypto.createVerify('SHA256');
    verify.write('some data to sign');
    verify.end();
    return verify.verify(publicKey, signature, 'hex');
}

module.exports = {
    NewAccount: NewAccount,
    LoadAccount: LoadAccount,
    SignData: SignData,
    VerifyData, VerifyData
};