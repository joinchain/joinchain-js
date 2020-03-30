var Joinchain = require("../../../src/index")
var utils = require("../../../src/utils/utils")
/**
 * 测试环境
 * http://39.99.153.32:8545 账户体系
 * http://39.99.153.32:9545 以太坊格式
 */
/**
 *  找回确认新地址
 *  找回地址：0xebbbb348a97d9173b055d22009d553dde7984133
    找回私钥：0x18ae5641c1c93c385ae39c047afce11f2eaa38d0cc63c5af80d38720c485639a
 */

//实例化
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://127.0.0.1:9545"));
//获取nonce
var res = joinchain.RequestManager.send("apps_getTransactionCount",["user@joinchain.io", "pending"]);
var nonce = utils.toDecimal(res);

var input =  [
    6,
    []
];
//组装数据
var raxTx = {
    from: "user@joinchain.io",
    to: "user@joinchain.io",
    interpreter:"joinchain.lost",
    nonce: nonce,
    gasLimit:2000000,
    gasPrice:0,
    value:0,
    input:input,
    deadline:0
}
console.log(raxTx)
var privateKey= "18ae5641c1c93c385ae39c047afce11f2eaa38d0cc63c5af80d38720c485639a";
var sign = joinchain.Transation.sign(raxTx,privateKey); 
//签名rpc请求
var sendRes = joinchain.RequestManager.send("joinchain_sendRawTransaction",[0,"0x"+sign.toString("hex")]);
console.log("send方法结果：\n " + sendRes + '\n');

