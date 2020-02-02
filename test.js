var joinchain_account = require('../joinchain-account');
// 显示接口
console.log(joinchain_account);

// 创建账号
private = joinchain_account.NewAccount();
console.log("创建私钥："+ JSON.stringify(private));

// 加载账号
key = joinchain_account.LoadAccount(private);
console.log("加载账号：" + JSON.stringify(key));

// 导出私钥
privateKey = joinchain_account.GetPrivate(private);
console.log("导出私钥：" + privateKey);

// 导出公钥
public = joinchain_account.GetPublic(private);
console.log("导出公钥：" + public);

// 导出地址
address = joinchain_account.GetAddress(private);
console.log("导出地址：" + address);

// 签名
sig = joinchain_account.SignData("12345678", key)
console.log("签名结果：" + sig)

// 验证签名
result = joinchain_account.VerifyData("12345678", sig, key)
console.log("验证签名结果：" + result)