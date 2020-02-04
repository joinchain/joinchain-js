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

//签名
var data = "hello,world";
var signature = Joinchain.Account.sign(data,privateKey);
console.log("信息为："+ data + " 签名后内容为：" + signature + '\n');

//验证签名
var checkResult = Joinchain.Account.verify(data,signature,privateKey);
console.log("验证结果为：" + checkResult);