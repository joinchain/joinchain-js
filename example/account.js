var joinchain = require('../src/index');
//实例化Joinchain对象
var Joinchain = new joinchain();
//创建账号
Joinchain.Account.newAccount();

//获取私钥
var privateKey = Joinchain.Account.getPrivate("true");// true:前面加0x，false不加
console.log("私钥长度为 = " + privateKey.length + '\n');
console.log("私钥为 = " + privateKey + '\n');

//获取公钥
var publicKey = Joinchain.Account.getPublic("true");
console.log("不压缩公钥长度为 = " + publicKey.length + '\n')
console.log("不压缩公钥为 = " + publicKey + '\n');

var compressedPublic = Joinchain.Account.toCompressedPublicKey("hex")
console.log("压缩公钥长度为 = " + compressedPublic.length + '\n')
console.log("压缩公钥为 = " + compressedPublic + '\n');

//获取地址
var address = Joinchain.Account.getAddress();
console.log("地址长度为 = " + address.length + '\n')
console.log("地址为 = " + address + '\n');

//第三方导入账户
 Joinchain.Account.loadAccount(privateKey);
//第三方获取公钥
var publicKey = Joinchain.Account.getPublic("true");
console.log("第三方导入公钥长度为 = " + publicKey.length + '\n')
console.log("第三方导入公钥为 = " + publicKey + '\n');

//第三方获取地址
var address = Joinchain.Account.getAddress();
console.log("第三方导入地址长度为 = " + address.length + '\n')
console.log("第三方导入地址为 = " + address + '\n');