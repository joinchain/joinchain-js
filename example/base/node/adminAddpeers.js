var Joinchain = require("../../../src/index");

//实例化joinchain对象
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://127.0.0.1:9546"));
//查询账户信息 {"method":"accounts_accountInfo","params":["admin@joinchain.io", "latest"],"id":1}
var sendRes = joinchain.RequestManager.send("admin_addPeer",["/ip4/127.0.0.1/tcp/8888/p2p/QmQWp6JpawMuXDZLqaiRoakAFHHeYRPTQDG6CmjbfbAXwH"]);
console.log("send方法结果：\n " + JSON.stringify(sendRes) + '\n');
