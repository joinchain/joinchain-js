var joinchain = require('../src/index');

//实例化Joinchain对象
var Joinchain = new joinchain();
//创建账号
Joinchain.Account.newAccount();

//获取私钥
var privateKey = Joinchain.Account.getPrivate("true");// true:前面加0x，false反之
console.log("私钥长度为 = " + privateKey.length + '\n');
console.log("私钥为 = " + privateKey + '\n');

//获取公钥
var publicKey = Joinchain.Account.getPublic("true");
console.log("公钥长度为 = " + publicKey.length + '\n')
console.log("公钥为 = " + publicKey + '\n');

//获取地址
var address = Joinchain.Account.getAddress();
console.log("地址长度为 = " + address.length + '\n')
console.log("地址为 = " + address + '\n');

//将私钥加密为keystore
var pwd = "123456";
var keystoreObj = Joinchain.Keystore.encrypt(privateKey,pwd);
console.log("keystore 为 \n" + JSON.stringify(keystoreObj) + '\n')

//将keystore 转为私钥key
var keystoreToPrivateKey = Joinchain.Keystore.decrypt(keystoreObj,pwd);
console.log("keystore 转为 privateKey 为: " + keystoreToPrivateKey + '\n')
