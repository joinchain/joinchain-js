var Joinchain = require("../../../src/index");

//实例化joinchain对象
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://127.0.0.1:9545"));
//查询账户nonce {"method":"joinchain_getTransaction","params":["0x0fc6fe77d78745532e35616fd692dc01a789d9e5596e53f18b59524cb8eeaf1a"],"id":1}
var sendRes = joinchain.RequestManager.send("joinchain_getTransaction",["0x34e2660ab3c5b417f1303c470a1cbc97af4d07e11384d3b10b70bb0999dab04b"]);
console.log("send方法结果：\n " + JSON.stringify(sendRes) + '\n');
