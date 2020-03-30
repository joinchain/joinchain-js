var Joinchain = require("../../src/index")
var utils = require("../../src/utils/utils")
/**
 * 测试环境
 * http://39.99.153.32:8545 账户体系
 * http://39.99.153.32:9545 以太坊格式
 */
//实例化
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://127.0.0.1:8545"));
//获取nonce
var res = joinchain.RequestManager.send("apps_getTransactionCount",["0x908f9918ffbb80f382af0ec4b50d56851d1436e8", "pending"]);
var nonce = utils.toDecimal(res);
//组装数据
var raxTx = {
    from: "0x908f9918ffbb80f382af0ec4b50d56851d1436e8",
    to: "0x908f9918ffbb80f382af0ec4b50d56851d1436e8",
    interpreter:"joinchain.ethereum",
    nonce: nonce,
    gasLimit:2000000,
    gasPrice:0,
    value:0,
    input:"0131231",
    deadline:0
}
console.log(raxTx)
var privateKey= "8f6456270f38e9f7427857cf2f9c7ab6f65d0ea4a75455e30b923d386d73caf5";
var sign = joinchain.Transation.sign(raxTx,privateKey); 
//签名rpc请求
var sendRes = joinchain.RequestManager.send("joinchain_sendRawTransaction",[0,"0x"+sign.toString("hex")]);
console.log("send方法结果：\n " + sendRes + '\n');
// var privateKey= "8f6456270f38e9f7427857cf2f9c7ab6f65d0ea4a75455e30b923d386d73caf5";

// var from = "908f9918ffbb80f382af0ec4b50d56851d1436e8";
// var to = "908f9918ffbb80f382af0ec4b50d56851d1436e8";
// var interpreter = "joinchain.ethereum";
// var nonce = Buffer.from("0","hex");
// var gasLimit = Buffer.from("2000000","hex"); 
// var gasPrice = Buffer.from("0","hex"); 
// var value = Buffer.from("0","hex");
// var input = Buffer.from("0131231","hex");
// var deadline = Buffer.from("0","hex");
// var signature = [];
// var extra = [];
// var extraHash = []

// var param =[
//     from,
//     to,
//     interpreter,
//     nonce,
//     gasLimit,
//     gasPrice,
//     value,
//     input,
//     deadline,
//     signature,
//     extra,
// ];
// console.log(param);
// //rlpHash
// var rlpHash =  utils.rlphash(param);
// console.log(rlpHash)

// var sig = joinchain.Transation.p256Sign(rlpHash,privateKey);
// var signSig =[
//     "P256",
//     null,
//     sig
// ];
// param[9] = utils.rlpEncode(signSig);
// console.log(param[9])
// param[10] = Buffer.from("02","hex")
// //返回签名raw
// var raw = utils.rlpEncode(param);
// var sendRes = joinchain.RequestManager.send("joinchain_sendRawTransaction",[0,"0x"+raw.toString("hex")]);
// console.log("send方法结果：\n " + sendRes + '\n');
// console.log(sig)
