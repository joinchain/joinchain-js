var Joinchain = require("../../../src/index");

//实例化joinchain对象
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://127.0.0.1:9545"));
//查询账户信息 {"method":"accounts_accountInfo","params":["admin@joinchain.io", "latest"],"id":1}
var sendRes = joinchain.RequestManager.send("accounts_accountInfo",["0xc008dc5378660504be599ca17803e28fd16d55e6@joinchain.contract", "latest"]);
console.log("send方法结果：\n " + JSON.stringify(sendRes) + '\n');
