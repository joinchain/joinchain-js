var joinchain_account = require('../joinchain-account');
// 显示接口
console.log(joinchain_account);

// 创建账号 
private = joinchain_account.Account.newAccount();
console.log("创建私钥："+ JSON.stringify(private) + "\n");

// 加载账号
key = joinchain_account.Account.loadAccount(private);
console.log("加载账号：" + JSON.stringify(key) + "\n");

// 导出私钥
privateKey = joinchain_account.Account.getPrivate(private);
console.log("导出私钥：" + privateKey + "\n");

// 导出公钥
public = joinchain_account.Account.getPublic(private);
console.log("导出公钥：" + public  + "\n");

// 导出地址
address = joinchain_account.Account.getAddress(private);
console.log("导出地址：" + address + "\n");

// 签名
sig = joinchain_account.Account.signData("12345678", key)
console.log("签名结果：" + sig + "\n")

// 验证签名
result = joinchain_account.Account.verifyData("12345678", sig, key)
console.log("验证签名结果：" + result + "\n")
