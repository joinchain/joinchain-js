# Joinchain-js keystore Usage

## 将私钥加密为keystore

```javascript

var pwd = "123456";
var keystoreObj = Joinchain.Keystore.encrypt(privateKey,pwd);

```

## 将keystore 转为私钥key

```javascript

var keystoreToPrivateKey = Joinchain.Keystore.decrypt(keystoreObj,pwd);

```