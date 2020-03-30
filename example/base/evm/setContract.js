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
//0x3A27133a1381e620773aFed14E0dF16aB78E0AAb
//0x3A27133a1381e620773aFed14E0dF16aB78E0AAb
var simpleContract = joinchain.contract(abi).at("0x01AFaa9CD6D296Ea9FaD9Ebe28bfD752F2Fc7602");
var getData = simpleContract.set.getData(3);
console.log(getData);
//组装数据
var raxTx = {
    from: "admin@joinchain.io",
    to: '0x01AFaa9CD6D296Ea9FaD9Ebe28bfD752F2Fc7602@joinchain.contract',
    interpreter:"joinchain.evm",
    nonce: nonce,
    gasLimit:2000000,
    gasPrice:0,
    value:0,
    input: getData.replace('0x',''),
    deadline:0
}
console.log(raxTx)
var privateKey= "7AC46DB941941262187682BF8BCFE75D1739B9E965823176C317A6421A1C2935";
var sign = joinchain.Transation.sign(raxTx,privateKey); 
//签名rpc请求
var sendRes = joinchain.RequestManager.send("joinchain_sendRawTransaction",[0,"0x"+sign.toString("hex")]);
console.log("send方法结果：\n " + sendRes + '\n');
//contract address = "0x8e666198db38c253bb56a1c86f7e5eda1ce1f35b";
