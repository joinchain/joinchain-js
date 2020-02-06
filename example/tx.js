var Tx = require('../src/tx/transaction')
var utils = require('../src/utils/utils')
var Joinchain = require("../src/index");

//实例化joinchain对象
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://39.99.153.32:10001"));
 //组装数据
var data = { "jsonrpc": "2.0", "method": "eth_accounts", "params": []}

//send 方法使用
var sendRes = joinchain.RequestManager.send(data);
console.log("send方法结果：\n " + sendRes + '\n');
var rawTx = {
    from:"0x147675caaafa721d4734884dbc0fe38a110b62ab",
    nonce: utils.toHex(0),
    gasPrice: utils.toHex(0),
    gasLimit:  utils.toHex("90000"),
    to: "0xc165704cf3db1e34ef25cc3e6c1a9b858f7bd22a",
    value: utils.toHex(utils.toWei(10,"ether")),
    input:"dasdasd",
    deadline:"dasdasda",
    signature:"dasdasd1",
    extra:"dasdadsas1"
}

var tx = new Tx(rawTx);
//console.log(tx);
tx.sign("9eed655b053eb6a9c8686d96986870de7ecdf189688241fbba272e7527e35683");
var res = tx.verifySignature("82fa168b8923796fc8fac79b8c9ce63dd40a0f8d23000c3d2441dbf075e84398")
console.log("验证结果："+res);
//console.log(tx);
//var serializedTx = tx.serialize();
//console.log("0x" + serializedTx.toString('hex'));