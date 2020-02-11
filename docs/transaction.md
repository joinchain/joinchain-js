# Joinchain-js keystore Usage

## 离线生成签名

```javascript

var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://127.0.0.1:7545"));
var nonce = 1;
//组装数据
var raxTx = {
    from: "0x908f9918ffbb80f382af0ec4b50d56851d1436e8",
    to: "0x908f9918ffbb80f382af0ec4b50d56851d1436e8",
    nonce: nonce,
    gasLimit:2000000,
    gasPrice:0,
    value:0,
    input:"0131231",
    deadline:0
}
var privateKey= "8f6456270f38e9f7427857cf2f9c7ab6f65d0ea4a75455e30b923d386d73caf5";
var sign = joinchain.Transation.sign(raxTx,privateKey);
//签名rpc请求
var sendRes = joinchain.RequestManager.send("joinchain_sendRawTransaction",[0,"0x"+sign.toString("hex")]);
```