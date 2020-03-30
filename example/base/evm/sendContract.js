var Joinchain = require("../../../src/index")
var utils = require("../../../src/utils/utils")
//实例化
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://127.0.0.1:9545"));
//获取nonce
var res = joinchain.RequestManager.send("apps_getTransactionCount",["admin@joinchain.io", "pending"]);
var nonce = utils.toDecimal(res);

//合约bytecode
var bytecode = "608060405234801561001057600080fd5b5060bf8061001f6000396000f30060806040526004361060485763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166360fe47b18114604d5780636d4ce63c146064575b600080fd5b348015605857600080fd5b5060626004356088565b005b348015606f57600080fd5b506076608d565b60408051918252519081900360200190f35b600055565b600054905600a165627a7a723058205c43d44674079a26bc7a53a0d2138035a6fe0f051123eb177b796cb3d3f381a70029";
//组装数据
var raxTx = {
    from: "admin@joinchain.io",
    to: "",
    interpreter:"joinchain.evm",
    nonce: nonce,
    gasLimit:2000000,
    gasPrice:0,
    value:0,
    input: bytecode,
    deadline:0
}
console.log(raxTx)
var privateKey= "7AC46DB941941262187682BF8BCFE75D1739B9E965823176C317A6421A1C2935";
var sign = joinchain.Transation.sign(raxTx,privateKey); 
//签名rpc请求
var sendRes = joinchain.RequestManager.send("joinchain_sendRawTransaction",[0,"0x"+sign.toString("hex")]);
console.log("send方法结果：\n " + sendRes + '\n');
//contract address = "0x8e666198db38c253bb56a1c86f7e5eda1ce1f35b";
