var Joinchain = require("../src/index");

//实例化joinchain对象
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://39.99.153.32:10001"));
 //组装数据
var data = { "jsonrpc": "2.0", "method": "apps_getTransactionCount", "params": ["0x908f9918ffbb80f382af0ec4b50d56851d1436e8", "latest"]}

//send 方法使用
var sendRes = joinchain.RequestManager.send(data);
console.log("send方法结果：\n " + sendRes + '\n');

//sendSync方法使用
// joinchain.RequestManager.sendAsync(data,function(err,result){
//     if(err){
//         console.log("faild");
//     }
//     console.log("sendAsync方法结果：\n " + result + '\n');
// });