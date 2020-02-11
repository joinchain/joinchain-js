# Joinchain-js Account Usage

## 生成private

```javascript

joinchain.Account.newAccount();

var privateKey = Joinchain.Account.getPrivate("true")

true : 返回值增加 "0x"; false : 返回值为产生原值
```

## 导入private

```javascript

joinchain.Account.loadAccount(privateKey);

```

## 获取不压缩公钥

```javascript

var publicKey = joinchain.Account.getPublic("true");

true : 返回值增加 "0x"; false : 返回值为产生原值

```

## 获取压缩公钥

```javascript

var compressedPublic = joinchain.Account.toCompressedPublicKey("hex")

```

## 获取地址

```javascript

var address = joinchain.Account.getAddress();

```