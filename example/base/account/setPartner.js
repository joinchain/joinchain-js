var Joinchain = require("../../../src/index")
var utils = require("../../../src/utils/utils")
/**
 * 测试环境
 * http://39.99.153.32:8545 账户体系
 * http://39.99.153.32:9545 以太坊格式
 */
/**
 *  本人
 *   addr: 0x908f9918ffbb80f382af0ec4b50d56851d1436e8
 *   private: 8f6456270f38e9f7427857cf2f9c7ab6f65d0ea4a75455e30b923d386d73caf5
 *   user: user@joinchain.io
 */

/**
 *  合作伙伴
 *  addr:0x56b659538117fa24085536d20da6398557810845
 *  private:0xb7cdb827ee6c8a310fac5047463f241f79f7a53945242850e599aa176b049612
 *  user: user1@joinchain.io
 */
//实例化
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://127.0.0.1:9545"));
//获取nonce
var res = joinchain.RequestManager.send("apps_getTransactionCount",["user@joinchain.io", "pending"]);
var nonce = utils.toDecimal(res);
/**
 *  CN     string   用户名称 
	Domain string   所在域
 */

var opation=[
    "user1",
    "joinchain.io",
];
var input =  [
    4,
    opation
];
//组装数据
var raxTx = {
    from: "user@joinchain.io",
    to: "user1@joinchain.io",
    interpreter:"joinchain.account",
    nonce: nonce,
    gasLimit:2000000,
    gasPrice:0,
    value:0,
    input:input,
    deadline:0
}
console.log(raxTx)
var privateKey= "8f6456270f38e9f7427857cf2f9c7ab6f65d0ea4a75455e30b923d386d73caf5";
var sign = joinchain.Transation.sign(raxTx,privateKey); 
//签名rpc请求
var sendRes = joinchain.RequestManager.send("joinchain_sendRawTransaction",[0,"0x"+sign.toString("hex")]);
console.log("send方法结果：\n " + sendRes + '\n');
