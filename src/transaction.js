'use strict';
var BN = require('bn.js');
var utils = require("./utils/utils")
var secp256r1 = require('secp256r1')

var Transation = function Transation(){
    this.fields = [{
        name : 'from',
        default: Buffer.from([])
    },{
        name: 'to',
        default: Buffer.from([])
    },{
        name: 'nonce',
        default: Buffer.from([])
    },{
        name: 'gasLimit',
        default: new BN()
    },{
        name: 'gasPrice',
        default: Buffer.from([])
    },{
        name:'value',
        default: Buffer.from([])
    },{
        name: 'input',
        default: Buffer.from([])
    },{
        name: 'deadline',
        default: Buffer.from([])
    },{
        name: 'signature',
        default: []
    },{
        name: 'extra',
        default: []
    }];
    this.raw = 0;
}

/**
 * 签名
 */
Transation.prototype.sign = function(data,privateKey){
    //第一步kecck和rlphash
    var rlpHash = this.rlpHash(data);
    //第二步赋值signature
    var sig = this.p256Sign(rlpHash,privateKey);
    //第三步rlpencode
    //将签名和extra数据重新赋值到数组上
    this.raw[8] = sig;
    this.raw[9] = Buffer.from("02","hex")
    //返回签名raw
    var raw = utils.rlpEncode(this.raw);
    return raw;
}

/**
 * rlpHash
 */
Transation.prototype.rlpHash = function(data){
    var param = [];
    // 数据与fields比对，赋值到this.raw中
    this.fields.forEach(function(field,i){
        if(field.name == "from" || field.name == "to"){
            //判断是否是地址
            if(!utils.isAddress(data[field.name])){
                throw new Error('Invalid address');
            }   
        }
        if(typeof data[field.name] == "string" && data[field.name].substring(0, 2) === '0x'){
            //去掉前面0x
            data[field.name] = data[field.name].replace('0x','');
        }

        if(typeof data[field.name] == 'number' && data[field.name] > 10 ){
            param[i] =  new BN(data[field.name]);
        }else if(field.name == "signature" || field.name == "extra"){
            param[i] = field.default;
        }else{
            if(typeof data[field.name] == 'number' && data[field.name] > 0 && data[field.name] < 10 ){
                data[field.name] = "0" + data[field.name];
              }else if(data[field.name] == 0){
                    param[i] = Buffer.from(String(data[field.name]),"hex"); 
            }else{
                    param[i] = Buffer.from(data[field.name],"hex"); 
            }
            console.log("name为：" + field.name + " 值为：" + data[field.name] + "\n");
            
        }
    })
    this.raw = param;
    var rlpHash =  utils.rlphash(this.raw);
    return rlpHash;
}

/**
 * p256 签名
 */
Transation.prototype.p256Sign = function(rlpHash,privateKey){
    //如果包含0x则去除
    if(privateKey.substring(0, 2) == "0x") {
        privateKey = privateKey.substring(2);
    }
    privateKey = Buffer.from(privateKey, "hex")
    // sign the message
    var sigObj = secp256r1.sign(rlpHash, privateKey)
    //生成签名
    var sig = Buffer.concat([sigObj.signature,Buffer.from([sigObj.recovery])])
    return sig;
}
module.exports = Transation;
