const { randomBytes } = require('crypto')
const secp256r1 = require('secp256r1')
const keccak256 = require('keccak256')
var utils = require('../src/utils/utils')
var Tx = require('../src/tx/transaction')
var util = require('../src/tx/util')
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


//真正的测试
var from = "0x908f9918ffbb80f382af0ec4b50d56851d1436e8";
//定义签名内容
var rawTx = {
    from:from,
    to: from,
    nonce: utils.toHex(0),
    gasLimit: utils.toHex(2000000),
    gasPrice: utils.toHex(0),
    value: utils.toHex(0),
    input: utils.toHex(01),
    deadline:utils.toHex(0),
    signature:"",
    extra:""
}
// from = Buffer.from(rawTx.from);
// to = Buffer.from(rawTx.to);
// nonce =  Buffer.from(rawTx.nonce);
// //console.log(nonce);
// gasLimit = Buffer.from(rawTx.gasLimit);
// gasPrice = Buffer.from(rawTx.gasPrice);
// value = Buffer.from(rawTx.value);
// input = Buffer.from(rawTx.input);
// deadline = Buffer.from(rawTx.deadline);
// signature = Buffer.from(rawTx.signature);
// extra = Buffer.from(rawTx.extra);
// arr =[
//     from,
//     to,
//     nonce,
//     gasLimit,
//     gasPrice,
//     value,
//     input,
//     deadline,
//     signature,
//     extra
// ];
//data = Buffer.concat([from,to,nonce,gasLimit,gasPrice,value,input,deadline,signature,extra]);
// console.log(arr);
// var msg =  util.rlphash(arr);
// console.log(msg.toString("hex"));
var tx = new Tx(rawTx);
var msgHash = tx.sign("8f6456270f38e9f7427857cf2f9c7ab6f65d0ea4a75455e30b923d386d73caf5");
//console.log(msgHash.toString("hex"));
// const sigMsgObj = secp256r1.sign(msgHash, privateKey)
// console.log(sigMsgObj);
// console.log("test-signature:",sigMsgObj.signature.toString("hex"))

var serializedTx = tx.serialize();
console.log("0x" + serializedTx.toString('hex'));
 //组装数据
 var data = { "jsonrpc": "2.0", "method": "joinchain_sendRawTransaction", "params": [0,"0x" + serializedTx.toString('hex')]}

 //send 方法使用
//  var sendRes = joinchain.RequestManager.send(data);
//  console.log("send方法结果：\n " + sendRes + '\n');
