var Joinchain = require("../../../src/index");

//实例化joinchain对象
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://127.0.0.1:9545"));
//查询账户信息 {"method":"accounts_accountInfo","params":["admin@joinchain.io", "latest"],"id":1}
var sendRes = joinchain.RequestManager.send("pbft_getSnapshot",["1"]);
console.log("send方法结果：\n " + JSON.stringify(sendRes) + '\n');
