var Joinchain = require("../../../src/index");

//实例化joinchain对象
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://127.0.0.1:9545"));
//查询账户nonce {"method":"apps_getTransactionCount","params":["0x92c8cae42a94045670cbb0bfcf8f790d9f8097e7", "latest"],"id":1}
var sendRes = joinchain.RequestManager.send("apps_getTransactionCount",["admin@joinchain.io", "latest"]);
console.log("send方法结果：\n " + sendRes + '\n');
