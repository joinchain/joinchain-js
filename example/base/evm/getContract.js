var Joinchain = require("../../../src/index")
var utils = require("../../../src/utils/utils")
//实例化
//var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://192.168.3.106:9545"));
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://127.0.0.1:9545"));
//获取nonce
var res = joinchain.RequestManager.send("apps_getTransactionCount",["admin@joinchain.io", "pending"]);
var nonce = utils.toDecimal(res);

//合约bytecode
var abi = [{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
//0x862cD3Cd032980D05AE9419f401651f2C8d58785
//0x862cD3Cd032980D05AE9419f401651f2C8d58785
var simpleContract = joinchain.contract(abi).at("0x01AFaa9CD6D296Ea9FaD9Ebe28bfD752F2Fc7602");
var getData = simpleContract.get.getData();
console.log(getData);
const Hexstring2btye = (str)=> {
    let pos = 0;
    let len = str.length;
    if (len % 2 != 0) {
        return null;
    }
    len /= 2;
    let hexA = new Array();
    for (let i = 0; i < len; i++) {
        let s = str.substr(pos, 2);
        let v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }
    return hexA;
}

var getData = getData.replace('0x','');
var raxTx = {
    from: "0x92c8cae42a94045670cbb0bfcf8f790d9f8097e7",
    to: "0x01AFaa9CD6D296Ea9FaD9Ebe28bfD752F2Fc7602",
    nonce: nonce,
    gasLimit:2000000,
    gasPrice:0,
    amount:0,
    data:  Hexstring2btye(getData),//[109,76,230,60],//Buffer.from(getData,"hex"),
    checkNonce:true,
}
console.log(raxTx)
//var privateKey= "7AC46DB941941262187682BF8BCFE75D1739B9E965823176C317A6421A1C2935";
//var sign = joinchain.Transation.sign(raxTx,privateKey); 
console.log([raxTx,"pending"]);
//签名rpc请求
var sendRes = joinchain.RequestManager.send("apps_call",[raxTx,"pending"]);
console.log("send方法结果：\n " + sendRes + '\n');
// simpleContract.get.call(function(err, num){
//     if(err){
//         console.log(err);
//     }
//     console.log(num)
// });
