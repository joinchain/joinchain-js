const crypto = require('crypto');

// 返回 {publicKey, privateKey}
function genKeyPair(passphrase) {
    return crypto.generateKeyPairSync('ec', {
        namedCurve: 'P-256',
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8', // 用于存储私钥信息的标准语法标准
            format: 'pem', // base64 编码的 DER 证书格式
            cipher: 'aes-256-cbc', // 加密算法和操作模式
            passphrase
        }
    });
}

// 使用公钥加密数据
function publicEncrypt(data, publicKey, encoding) {
    const msg = JSON.stringify(data);
    const encryptBuffer = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING // 填充方式，需与解密一致
    }, Buffer.from(msg, 'utf8'));
    if (encoding) {
        return encryptBuffer.toString(encoding);
    } else {
        return encryptBuffer;
    }
}

// 使用私钥解密数据
function privateDecrypt(privateKey, passphrase, encryptBuffer) {
    const msgBuffer = crypto.privateDecrypt({
        key: privateKey,
        passphrase,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, encryptBuffer);

    return JSON.parse(msgBuffer.toString('utf8'));
}

// 使用私钥签名数据
function privateSign(privateKey, passphrase, encryptBuffer, encoding) {
    const sign = crypto.createSign('SHA256');
    sign.update(encryptBuffer);
    sign.end();
    const signatureBuffer = sign.sign({
        key: privateKey,
        passphrase
    });
    if (encoding) {
        return signatureBuffer.toString(encoding);
    } else {
        return signatureBuffer;
    }
}

// 使用公钥验证签名
function publicVerify(publicKey, encryptBuffer, signatureBuffer) {
    const verify = crypto.createVerify('SHA256');
    verify.update(encryptBuffer);
    verify.end();
    return verify.verify(publicKey, signatureBuffer);
}

module.exports = {
    genKeyPair,
    publicEncrypt,
    privateDecrypt,
    privateSign,
    publicVerify
};