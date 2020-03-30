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
 *  设置权限的账号
 *  0x0f32140bfdf21bebf9dc04ddeeabad3eeb43dcf1
 *  dev_user@dev.joinchain.io
 *  b52acca30b57f2ce98341a9322fddbbb10f3bc3dbc57c36d4e1409c25f47948a
 */
//实例化
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://127.0.0.1:9545"));
//获取nonce
var res = joinchain.RequestManager.send("apps_getTransactionCount",["admin@joinchain.io", "pending"]);
var nonce = utils.toDecimal(res);
/**
 *  CN     string   用户名称 
	Domain string   所在域
	Permissions Permissions{
        RegisterUser      bool `json:"registerUser"`      // 是否允许注册用户
        UpdateUser        bool `json:"updateUser"`        // 是否允许更新用户权限
        FrozenUser        bool `json:"frozenUser"`        // 是否允许冻结用户
        RegisterDomain    bool `json:"registerDomain"`    // 是否允许建立新的域名
        RegisterSubdomain bool `json:"registerSubDomain"` // 是否允许建立子域
    }
 */

var opation=[
    "dev_user",
    "dev.joinchain.io",
    [1,1,1,0,0]
];
var input =  [
    2,
    opation
];
//组装数据
var raxTx = {
    from: "admin@joinchain.io",
    to: "dev_user@joinchain.io",
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
