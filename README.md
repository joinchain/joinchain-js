# joinchain package
本项目是为 Joinchain 区块链提供客户端支持的 Nodejs 接口，通过本项目可以接入 Joinchain 区块链，实现区块链的使用。
This project is a nodejs interface that provides client support for joinchain blockchain. Through this project, joinchain blockchain can be accessed.

本项目包含以下内容：
Joinchain package list
1. joinchain.Account    joinchain 账号
2. joinchain.Tx         joinchain 交易，离线签名
3. joinchain.Keystore   joinchain 离线账号存储

## joinchain.Account
The nodejs account interface for joinchain and is included in the joinchain package.
* Example code
```
var joinchain = require('joinchain');
// 显示接口
console.log(joinchain);

// 创建账号 
private = joinchain.Account.newAccount();
console.log("创建私钥："+ JSON.stringify(private) + "\n");

// 加载账号
key = joinchain.Account.loadAccount(private);
console.log("加载账号：" + JSON.stringify(key) + "\n");

// 导出私钥
privateKey = joinchain.Account.getPrivate(private);
console.log("导出私钥：" + privateKey + "\n");

// 导出公钥
public = joinchain.Account.getPublic(private);
console.log("导出公钥：" + public  + "\n");

// 导出地址
address = joinchain.Account.getAddress(private);
console.log("导出地址：" + address + "\n");

// 签名
sig = joinchain.Account.signData("12345678", key)
console.log("签名结果：" + sig + "\n")

// 验证签名
result = joinchain.Account.verifyData("12345678", sig, key)
console.log("验证签名结果：" + result + "\n")
```

## joinchain-tx

## joinchain-keystore