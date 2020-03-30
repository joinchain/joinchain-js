'use strict';

var BN = require('bn.js');
var utils = require("./utils/utils")
var secp256r1 = require('secp256r1')

var Transation = function Transation(){
    this.fields = [{
        name : 'from',
        default: ""
    },{
        name: 'to',
        default: ""
    },{
        name:  "interpreter",
        default: ""
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
    var signature = [
        "P256",
         null,
         sig
    ];
    this.raw[9] = utils.rlpEncode(signature);
    this.raw[10] = Buffer.from("02","hex")
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
        //检查账户有效性
        if(field.name == "from" || field.name == "to"){
            //判断是eth模式还是基本模式
            if(!modeType(data["interpreter"], data[field.name])){
                throw new Error('Invalid address');
            }   
        }
        //处理input
        if(field.name == "input") {
            data[field.name] = inputType(data["interpreter"],data[field.name]);
        }
        //去掉0x
        // if(typeof data[field.name] == "string" && data[field.name].substring(0, 2) === '0x'){
        //     //去掉前面0x
        //     data[field.name] = data[field.name].replace('0x','');
        // }
        //签名默认值
        if(field.name == "signature" || field.name == "extra"){
            param[i] = field.default;
        }else if(field.name == "from" || field.name == "to"|| field.name == "interpreter"){//字符串
            param[i] = data[field.name];
        }else if(typeof data[field.name] == 'number'){//number处理
            if(data[field.name] >= 10){
                param[i] = new BN(data[field.name]);
            }else if(data[field.name] == 0) {
                param[i] = Buffer.from(String(data[field.name]),"hex"); 
            }else{
                param[i] = Buffer.from("0" + data[field.name],"hex");
            }
        }else{
            if(field.name=="input"){
                console.log("111" + data[field.name]);
                console.log(Buffer.from(data[field.name],"hex"));
            }
            param[i] = Buffer.from(data[field.name],"hex");    
        }
    })
    this.raw = param;
    console.log(this.raw);
    var rlpHash =  utils.rlphash(this.raw,data["interpreter"]);
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
    console.log(sigObj);
    //生成签名
    var sig = Buffer.concat([sigObj.signature,Buffer.from([sigObj.recovery])])
    return sig;
}

/**
 * modeType
 * eth模式还是基本模式
 */
var modeType = function(mode,param){
    if(mode == "joinchain.ethereum") {
        //判断是否是地址
        if(!utils.isAddress(param)){
            return false;
        }   
    }else {
        if(!utils.isString(param)) {
            return false;
        }
    }
    return true;
}
/**
 * input组装
 */
var inputType = function(mode,input){
    var inputData = '';
    if(mode == "joinchain.account"){
        if(!utils.isArray(input)){
            return input;
        }
        switch(input[0]){
            //创建用户
            case 0:
                inputData = addAccount(mode,input);
                break;
            case 1:
                inputData = frozenAccount(mode,input);
                break;
            case 2:
                inputData = updatePermission(mode,input);
                break;
            case 3:
                inputData = addAccount(mode,input);
                break;
            case 4:
                inputData = setPartner(mode,input);
                break;
            default:
                inputData = input;
                break;
        }
    }else if(mode == "joinchain.lost"){
        switch(input[0]){
            //找回
            case 5:
                inputData = lostRequest(mode,input);
                break;
            case 6:
                inputData = foundRequest(mode,input);
                break;
            case 7:
                inputData = lostReset(mode,input);
                break;
            default:
                inputData = input;
                break;
        }
    } else{
        inputData = input;
    }
    return inputData;
    
    
}
/**
 * 注册
 * @param {array}} input 
 * [
 *     type 0 注册
 *     [
 *          nonce,
 *          Balance,
 *          Addresses[['address','']]二维数组
 *          CN,用户名称
 *          Domain,注册域
 *          IsAdmin,是否为管理员
 *          DeployContract,是否允许合约部署
 *          Permissions,权限
 *          IsFrozen,是否冻结 0、1
 *          XXX...扩展字段
 *          
 *     ]
 * ]
 */
var addAccount = function(mode,input){
    var operation = input[0];//操作类型
    var data = input[1];
    //addresses = data[2];
    if(!utils.isArray(data[2])){
        throw new Error('address is vaild');
    }
    //判断地址是否有前缀，去掉0x;addr = addresses[0][0];
    if(typeof data[2][0][0] == "string" && data[2][0][0].substring(0, 2) === '0x'){
        //去掉前面0x
        data[2][0][0] = data[2][0][0].replace('0x','');
    }
    if(!utils.isArray(data[2][0][1])){
        data[2][0][1] = [];
    }
    var dataRlp = utils.rlpEncode(data,mode);
    var inputData = utils.rlpEncode([operation,dataRlp],mode);
    return inputData;

}

/**
 * 冻结/解冻操作input值
 * @param {*} input 
 * [
 *     type 1 冻结/解冻
 *     [
 *          CN,用户名称
 *          Domain,注册域
 *          frozen,是否冻结 0、1    
 *     ]
 * ]
 */
var frozenAccount = function(mode,input){
    var dataRlp = utils.rlpEncode(input[1],mode);
    var inputData = utils.rlpEncode([input[0],dataRlp],mode);
    return inputData;
}
/**
 * 更新子域的管理员权限
 * @param {array} input 
 */
var updatePermission = function(mode,input){
    var dataRlp = utils.rlpEncode(input[1],mode);
    var inputData = utils.rlpEncode([input[0],dataRlp],mode);
    return inputData;
}

/**
 * 
 * 设置合作伙伴
 * @param {array} input 
 */
var setPartner = function(mode,input){
    var dataRlp = utils.rlpEncode(input[1],mode);
    var inputData = utils.rlpEncode([input[0],dataRlp],mode);
    return inputData;
}

/**
 * 找回申请
 * @param {array} input 
 */
var lostRequest = function(mode,input){
    var dataRlp = utils.rlpEncode(input[1],mode);
    var inputData = utils.rlpEncode([input[0],dataRlp],mode);
    return inputData;
}

/**
 * 找回确认
 * @param {array} input 
 */
var foundRequest = function(mode,input){
    var dataRlp = utils.rlpEncode(input[1],mode);
    var inputData = utils.rlpEncode([input[0],dataRlp],mode);
    return inputData;
}

/**
 * 取消找回
 * @param {array}} input 
 */
var lostReset = function(mode,input){
    var dataRlp = utils.rlpEncode(input[1],mode);
    var inputData = utils.rlpEncode([input[0],dataRlp],mode);
    return inputData;
}

module.exports = Transation;
