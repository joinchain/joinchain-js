# joinchain-js package

joinchain-js accounts interface
本项目是为 Joinchain 区块链提供客户端支持的 js 接口，通过本项目可以接入 Joinchain 区块链，实现区块链的使用。
This project is a js interface that provides client support for joinchain blockchain. Through this project, joinchain blockchain can be accessed.

本项目包含以下内容：
Joinchain-js package list
1. joinchain.Account        joinchain 账号 
2. joinchain.HttpProvider   joinchain http提供商接口
3. joinchain.Keystore       joinchain 离线账号存储

## INSTALL

`npm install joinchain-js`

install with `-g` if you want to use the cli.

## USAGE

```javascript

var Joinchain = require('joinchain-js');
var joinchain = new Joinchain();

//account
joinchain.Account.XXX();

//keystore
joinchain.Keystore.XXX();

//transaction
joinchain.Transation.XXX();

//rpc
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://127.0.0.1:7545"));
```

-[more account usage](docs/account.md)

-[more keystore usage](docs/keystore.md)

-[more transaction-sign usage](docs/transaction.md)
