var joinchain = require('../src/index');
var  ECDSA = require('../src/crypto/index')
var crypto = require("crypto");
var keccak256 = require('keccak256');
//实例化Joinchain对象
var Joinchain = new joinchain();
//创建账号
Joinchain.Account.newAccount();

// //获取私钥
// var privateKey = Joinchain.Account.getPrivate("true");// true:前面加0x，false反之
// console.log("私钥长度为 = " + privateKey.length + '\n');
// console.log("私钥为 = " + privateKey + '\n');

// //获取公钥
// var publicKey = Joinchain.Account.getPublic("true");
// console.log("公钥长度为 = " + publicKey.length + '\n')
// console.log("公钥为 = " + publicKey + '\n');

// //获取地址
// var address = Joinchain.Account.getAddress();
// console.log("地址长度为 = " + address.length + '\n')
// console.log("地址为 = " + address + '\n');
privateKey = "8f6456270f38e9f7427857cf2f9c7ab6f65d0ea4a75455e30b923d386d73caf5"
//第三方导入账户
//Joinchain.Account.loadAccount(privateKey);
ecdh = crypto.createECDH("prime256v1")
ecdh.setPrivateKey(privateKey,"hex")
var privateECKey = new ECDSA({
    d: ecdh.getPrivateKey(),
    x: ecdh.getPublicKey().slice(1, Math.ceil(256 / 8) + 1),
    y: ecdh.getPublicKey().slice(Math.ceil(256 / 8) + 1)
})
var key = ECDSA.fromJWK(privateECKey)
var public = privateECKey.toCompressedPublicKey("hex")
console.log(public);
var buffer = Buffer.concat([key.x,key.y]);
if (!Buffer.isBuffer(buffer)) {
    throw new Error('this key must be a buffer object in order to get public key address');
}
console.log("0x" + keccak256(buffer).slice(12).toString('hex'));
return "0x" + keccak256(buffer).slice(12).toString('hex');
//console.log(public)
//var buffer = Buffer.concat([key.x,key.y]);
//console.log("0x"+buffer.toString("hex"))
//第三方获取公钥
// var publicKey = Joinchain.Account.getPublic("true");
// console.log("第三方导入公钥长度为 = " + publicKey.length + '\n')
// console.log("第三方导入公钥为 = " + publicKey + '\n');

// //第三方获取地址
// var address = Joinchain.Account.getAddress();
// console.log("第三方导入地址长度为 = " + address.length + '\n')
// console.log("第三方导入地址为 = " + address + '\n');

// //签名
// var data = "hello,world";
// var signature = Joinchain.Account.sign(data,privateKey);
// console.log("信息为："+ data + " 签名后内容为：" + signature + '\n');

// //验证签名
// var checkResult = Joinchain.Account.verify(data,signature,privateKey);
// console.log("验证结果为：" + checkResult);