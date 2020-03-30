var Joinchain = require("../../../src/index")
var utils = require("../../../src/utils/utils")
/**
 * 测试环境
 * http://39.99.153.32:8545 账户体系
 * http://39.99.153.32:9545 以太坊格式
 */
/**
 *  域管理员
 *  0x92c8cae42a94045670cbb0bfcf8f790d9f8097e7
 *  admin@joinchain.io
 *  7AC46DB941941262187682BF8BCFE75D1739B9E965823176C317A6421A1C2935
 */
/**
 *  注册
 *  0x908f9918ffbb80f382af0ec4b50d56851d1436e8
 *  user@joinchain.io
 *  8f6456270f38e9f7427857cf2f9c7ab6f65d0ea4a75455e30b923d386d73caf5
 */
//实例化
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://127.0.0.1:9545"));
//获取nonce
var res = joinchain.RequestManager.send("apps_getTransactionCount",["admin@joinchain.io", "pending"]);
var nonce = utils.toDecimal(res);

/**
 * Nonce     uint64                          `json:"nonce"`
	Balance   *big.Int                        `json:"balance"`
	Addresses map[types.Address]*AddressStore `json:"addresses"`

	CN     string `json:"cn"`     // 用户名称 common name
	Domain string `json:"domain"` // 所在域

	IsAdmin        bool         `json:"isAdmin"`               // 是否为管理员
	DeployContract bool         `json:"deployContract"`        // 是否允许部署合约
	Permissions    *Permissions `json:"permissions" rlp:"nil"` // 管理员权限。只有管理员需要设置

	IsFrozen bool `json:"isFrozen"` // 账户是否被冻结

	XXX map[string][]byte `json:"xxx"` // 扩展字段
 */
var opation=[
    0,
    0,
    [[Buffer.from("56b659538117fa24085536d20da6398557810845","hex"),[]]],
    "user1",
    "joinchain.io",
    0,
    1,
    null,
    0,
    []
];
var input =  [
    0,
    opation
];
//组装数据
var raxTx = {
    from: "admin@joinchain.io",
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
var privateKey= "7AC46DB941941262187682BF8BCFE75D1739B9E965823176C317A6421A1C2935";
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
