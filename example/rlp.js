var utils = require('../src/utils/utils')
var utils = require('../src/utils/utils')
var Tx = require('../src/tx/transaction')
var util = require('../src/tx/util')
var BN = require('bn.js');
const secp256r1 = require('secp256r1')
var rlp = require('rlp');
var Joinchain = require("../src/index");

//16to=>2
const Hexstring2btye = (str)=> {
    let pos = 0;
    let len = str.length;
    if (len % 2 != 0) {
        return null;
    }
    len /= 2;
    let hexA = new Array();
    for (let i = 0; i < len; i++) {
        let s = str.substr(pos, 2);
        let v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }
    return hexA;
 }


 var privateKey= Buffer.from("8f6456270f38e9f7427857cf2f9c7ab6f65d0ea4a75455e30b923d386d73caf5", "hex")
//真正的测试
var from = "908f9918ffbb80f382af0ec4b50d56851d1436e8";
 
 //fromBuffer = Hexstring2btye("908f9918ffbb80f382af0ec4b50d56851d1436e8")
 //一个参数的时候正确 from
//  fromBuffer = Buffer.from("908f9918ffbb80f382af0ec4b50d56851d1436e8","hex")
//  console.log(fromBuffer)
//  var msg =  util.rlphash(fromBuffer);
//  console.log(msg)
//  console.log("from hash结果："+ msg.toString("hex"));
//  msg1  = Hexstring2btye(msg.toString("hex"))
//  console.log(msg1)

 //定义上链数据
 fromBuffer = Buffer.from("908f9918ffbb80f382af0ec4b50d56851d1436e8","hex")
 toBuffer = Buffer.from("908f9918ffbb80f382af0ec4b50d56851d1436e8","hex")
 nonceBuffer = Buffer.from("07","hex")
 gasLimitBuffer = new BN(2000000)//Buffer.from(2000000,"hex")
 gasPriceBuffer = Buffer.from("0","hex")
 valueBuffer = Buffer.from("0","hex")
 inputBuffer = Buffer.from("01","hex")
 deadlineBuffer = Buffer.from("0","hex")
 signatureBuffer = []
 extraBuffer = []//默认的时候为空数组
 //console.log(signatureBuffer)
 arr =[
     fromBuffer,
     toBuffer,
     nonceBuffer,
     gasLimitBuffer,
     gasPriceBuffer,
     valueBuffer,
     inputBuffer,
     deadlineBuffer,
     signatureBuffer,
     extraBuffer
    ]
//  console.log(fromBuffer);
//  console.log(toBuffer);
//  console.log(arr);
// rlpHash 计算
 var arr1 =  util.rlphash(arr);
 console.log(arr1)
 console.log("from hash结果："+ arr1.toString("hex"));
 msg1  = Hexstring2btye(arr1.toString("hex"))
 console.log(msg1)

//组装签名
const pubKey = secp256r1.publicKeyCreate(privateKey)
//console.log(pubKey.toString("hex"))
// sign the message
const sigObj = secp256r1.sign(arr1, privateKey)
//生成签名
sig = Buffer.concat([sigObj.signature,Buffer.from([sigObj.recovery])])
console.log("signature1:",sig.toString("hex"))
//将签名和extra数据重新赋值到数组上
arr[8] = sig;
arr[9] = Buffer.from("02","hex")
console.log(arr)
//生成raw
raw = rlp.encode(arr)
console.log(raw);
console.log("raw:" +"0x"+raw.toString("hex"))



//实例化joinchain对象
var joinchain = new Joinchain(new Joinchain.providers.HttpProvider("http://39.99.153.32:10001"));
 //组装数据
var data = { "jsonrpc": "2.0", "method": "joinchain_sendRawTransaction", "params": [0,"0x"+raw.toString("hex")]}

//send 方法使用
var sendRes = joinchain.RequestManager.send(data);
console.log("send方法结果：\n " + sendRes + '\n');






