var Joinchain = require("../src/index");

//实例化joinchain对象
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://39.99.153.32:10001"));
//send 方法使用
var sendRes = joinchain.RequestManager.send("apps_getTransactionCount",["0x908f9918ffbb80f382af0ec4b50d56851d1436e8", "pending"]);
console.log("send方法结果：\n " + sendRes + '\n');

//sendSync方法使用
// joinchain.RequestManager.sendAsync(data,function(err,result){
//     if(err){
//         console.log("faild");
//     }
//     console.log("sendAsync方法结果：\n " + result + '\n');
// });