var Joinchain = require("../../../src/index")
var utils = require("../../../src/utils/utils")
/**
 * 测试环境
 * http://39.99.153.32:8545 账户体系
 * http://39.99.153.32:9545 以太坊格式
 */
/**
 * joinchain.base 
 * joinchain链base类型上链交易
 */
//实例化
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://127.0.0.1:9545"));
//获取nonce
var res = joinchain.RequestManager.send("apps_getTransactionCount",["admin@joinchain.io", "pending"]);
var nonce = utils.toDecimal(res);
//组装数据
var raxTx = {
    from: "admin@joinchain.io",
    to: "admin@joinchain.io",
    interpreter:"joinchain.base",
    nonce: nonce,
    gasLimit:2000000,
    gasPrice:0,
    value:0,
    input:"111",
    deadline:0
}
console.log(raxTx)
var privateKey= "7AC46DB941941262187682BF8BCFE75D1739B9E965823176C317A6421A1C2935";
var sign = joinchain.Transation.sign(raxTx,privateKey); 
//签名rpc请求
var sendRes = joinchain.RequestManager.send("joinchain_sendRawTransaction",[0,"0x"+sign.toString("hex")]);
console.log("send方法结果：\n " + sendRes + '\n');
