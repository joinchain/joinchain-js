const { randomBytes } = require('crypto')
const secp256r1 = require('secp256r1')
const keccak256 = require('keccak256')
var utils = require('../src/utils/utils')
var Tx = require('../src/tx/transaction')
var util = require('../src/tx/util')
var BN = require('bn.js');
//const secp256r1 = require('secp256r1/elliptic')
//   if you want to use pure js implementation in node
 
// generate message to sign
//const hash = keccak256(Buffer.from("hello"))

const hash = Buffer.from("helloworldhelloworldhelloworld12")
console.log("msg: ", hash.toString('hex'))
console.log("hash(keccak256): ", hash.toString("hex"))
var privateKey= Buffer.from("8f6456270f38e9f7427857cf2f9c7ab6f65d0ea4a75455e30b923d386d73caf5", "hex")
 
// generate privKey
// let privKey
// do {
//   privKey = randomBytes(32)
// } while (!secp256r1.privateKeyVerify(privKey))
console.log("privateKey:", privateKey.toString('hex'))

// get the public key in a compressed format
const pubKey = secp256r1.publicKeyCreate(privateKey)
//console.log(pubKey.toString("hex"))

// sign the message
const sigObj = secp256r1.sign(hash, privateKey)
console.log(sigObj)
console.log("signature:",sigObj.signature.toString("hex"))
sig = Buffer.concat([sigObj.signature,Buffer.from([sigObj.recovery])])
console.log("signature1:",sig.toString("hex"))
console.log("signature2:",sigObj.signature.toString("hex")+"0"+sigObj.recovery.toString(2))
// // verify the signature
// console.log(secp256r1.verify(msg, sigObj.signature, pubKey))

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
//真正的测试
var from = "908f9918ffbb80f382af0ec4b50d56851d1436e8";
//定义签名内容
var rawTx = {
    from:Hexstring2btye(from),
    to: Hexstring2btye(from),
    nonce: Hexstring2btye(0),
    gasLimit: Hexstring2btye(utils.toHex(2000000)),
    gasPrice: Hexstring2btye(utils.toHex(0)),
    value: Hexstring2btye(utils.toHex(0)),
    input: Hexstring2btye(utils.toHex(01)),
    deadline: Hexstring2btye(utils.toHex(0)),
    signature:"",
    extra:""
}
// from = Buffer.from(rawTx.from,"hex");
// //console.log(from)
// to = Buffer.from(rawTx.to,"hex");
// nonce =  Buffer.from(rawTx.nonce,"hex");
// console.log(rawTx.gasLimit);
// gasLimit = Buffer.from(rawTx.gasLimit,"hex");
// console.log(gasLimit)
// gasPrice = Buffer.from(rawTx.gasPrice,"hex");
// value = Buffer.from(rawTx.value,"hex");
// input = Buffer.from(rawTx.input,"hex");
// deadline = Buffer.from(rawTx.deadline,"hex");
// signature = Buffer.from(rawTx.signature);
// extra = Buffer.from(rawTx.extra);
// arr =[
//     Hexstring2btye(from),
//     Hexstring2btye(from),
//     0,
//     2000000,
//     0,
//     0,
//     1,
//     0,
//     "",
//     ""
// ];
//  //console.log(arr)
// var msg =  util.rlphash(arr);
// console.log( Hexstring2btye(msg.toString("hex")))
// console.log("hash结果："+ msg.toString("hex"));

 //console.log(msg1)
// console.log(arr);
// var res =  util.rlphash(arr);
// console.log(res);
//data = Buffer.concat([from,to,nonce,gasLimit,gasPrice,value,input,deadline,signature,extra]);
 //console.log(arr);
 
 //fromBuffer = Hexstring2btye("908f9918ffbb80f382af0ec4b50d56851d1436e8")
//  fromBuffer = Buffer.from("908f9918ffbb80f382af0ec4b50d56851d1436e8","hex")
//  console.log(fromBuffer)
//  var msg =  util.rlphash(fromBuffer);
//  console.log(msg)
//  console.log("from hash结果："+ msg.toString("hex"));
//  msg1  = Hexstring2btye(msg.toString("hex"))
//  console.log(msg1)
 

//  toBuffer = Buffer.from("908f9918ffbb80f382af0ec4b50d56851d1436e8","hex")
//  console.log(toBuffer)
//  var msg1 =  util.rlphash(toBuffer);
//  console.log(msg1)
//  console.log("to hash结果："+ msg1.toString("hex"));
// console.log(rawTx.nonce)
//  nonceBuffer = Hexstring2btye("0x0")
//  console.log(nonceBuffer)
//  var msg2 =  util.rlphash(nonceBuffer);
//  console.log(msg2)
//  console.log("nonce hash结果："+ msg2.toString("hex"));
var tx = new Tx(rawTx);
var msgHash = tx.sign("8f6456270f38e9f7427857cf2f9c7ab6f65d0ea4a75455e30b923d386d73caf5");
//console.log(msgHash.toString("hex"));
// const sigMsgObj = secp256r1.sign(msgHash, privateKey)
// console.log(sigMsgObj);
// console.log("test-signature:",sigMsgObj.signature.toString("hex"))

// var serializedTx = tx.serialize();
// console.log("0x" + serializedTx.toString('hex'));
//  //组装数据
//  var data = { "jsonrpc": "2.0", "method": "joinchain_sendRawTransaction", "params": [0,"0x" + serializedTx.toString('hex')]}

 //send 方法使用
//  var sendRes = joinchain.RequestManager.send(data);
//  console.log("send方法结果：\n " + sendRes + '\n');
