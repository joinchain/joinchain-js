"use strict";

var crypto = require("crypto");
var keccak256 = require('keccak256');
var asn1 = require('asn1.js');
var BN = require('bn.js');
const ECDSA = require('./crypto/index')

/**
 * 相当于定义类并且可以实现构造函数
 */
var Account = function Account(cryptoName = "prime256v1") {
    // 显示所有支持的算法
    //console.log(crypto.getCurves())
    //console.log(crypto.getHashes());
    this.cryptoName = cryptoName;
    this.ecdh = crypto.createECDH(cryptoName)
}

/**
 * 创建账号
 *
 * @method newAccount
 * @param 
 * @return 
 */
Account.prototype.newAccount = function() {
     if(!this.ecdh) {
         throw new Error('crypto not createECDH');
     }
     this.ecdh.generateKeys()
     return this.ecdh;
}

/**
 * 加载账号
 * 
 * @method loadAccount
 * @param privateKey
 * @return 
 */
Account.prototype.loadAccount = function(privateKey) {
   if(!this.ecdh) {
        throw new Error('crypto not createECDH');
   }
   if(!privateKey){
    throw new Error('export a private key is null.');
   }
   //如果包含0x则去除
   if(privateKey.substring(0, 2) == "0x") {
     privateKey = privateKey.substring(2);
   }
   //设置对象
   return this.ecdh.setPrivateKey(privateKey,"hex")
}
/**
 * 获取私钥数据
 * 
 * @method getPrivate
 * @param  prefix
 * @return 
 */
Account.prototype.getPrivate = function(prefix = false) {
    if(!this.ecdh) {
        throw new Error('crypto not createECDH');
    }
    var privateKey =  this.ecdh.getPrivateKey().toString("hex");
    if(!privateKey){
        throw new Error('create a private key faild.');
    }
    if(!prefix){
        return privateKey;
    }
    return "0x" + privateKey;
}

/**
 * 获取公钥数据
 * 
 * @method getPublic
 * @param prefix
 * @return 
 */
Account.prototype.getPublic = function(prefix = false) {
    if(!this.ecdh) {
        throw new Error('crypto not createECDH');
    }
    var publicKey = this.ecdh.getPublicKey().toString("hex");
    if(!publicKey) {
        throw new Error('create a public key faild.');
    }
    if(!prefix){
        return publicKey;
    }
    return "0x" + publicKey;
}

/**
 * 导出账号地址
 * 
 * @method getAddress
 * @param 
 * @return 
 */
Account.prototype.getAddress = function() {
    if(!this.ecdh) {
        throw new Error('crypto not createECDH');
    }
    var publicKey = this.ecdh.getPublicKey()
    if(!publicKey) {
        throw new Error('create a public key faild.');
    }
    return "0x" + keccak256(publicKey).slice(12).toString('hex');
}

function toOIDArray(oid) {
    return oid.split('.').map(function(s) {
      return parseInt(s, 10)
    });
  }

/**
 * 签名数据（未启用）
 * 
 * @method signData
 * @param data
 * @param privateKey
 * @return 
 */
Account.prototype.signData = function(data,privateKey) {
    //console.log(this.cryptoName);
    var sign = crypto.createSign("sha256");
    var ecdh = this.loadAccount(privateKey);
    var ECPrivateKey = asn1.define('ECPrivateKey', function () {
        this.seq().obj(
            this.key('version').int(),
            this.key('privateKey').octstr(),
            this.key('parameters').optional().explicit(0).objid({
              '1 2 840 10045 3 1 7' : 'prime256v1'
            //   '1 3 132 0 10'        : 'secp256k1',
            //   '1 3 132 0 34'        : 'secp384r1',
            //   '1 3 132 0 35'        : 'secp521r1'
            }),
            this.key('publicKey').explicit(1).bitstr().optional()
        );
    });
    var pemKey = ECPrivateKey.encode({
        version: new BN(1),
        privateKey: ecdh.getPrivateKey(),
        parameters: toOIDArray('1.2.840.10045.3.1.7')//'prime256v1'
    }, 'pem', { label: 'EC PRIVATE KEY' });
    console.log(pemKey);
    // var ECPrivateKey = asn1.define('ECPrivateKey', function() {
    //     this.seq().obj(
    //       this.key('version').int(),
    //       this.key('privateKey').octstr(),
    //       this.key('parameters').explicit(0).objid().optional(),
    //       this.key('publicKey').explicit(1).bitstr().optional()
    //     );
    //   });
    // var pemKey = ECPrivateKey.encode({
    //     version: new BN(1),
    //     privateKey: ecdh.getPrivateKey(),
    //     // OID for brainpoolP512t1
    //     parameters: toOIDArray('1.3.36.3.3.2.8.1.1.14')
    //   }, 'pem', { label: 'EC PRIVATE KEY' });
    
    sign.update(data);
    return sign.sign(pemKey, 'hex');
}

/**
 * 验证签名数据(未启用)
 * 
 * @method signData
 * @param data
 * @param signature
 * @param publicKey
 * @return 
 */
Account.prototype.verifyData = function(data, signature, privateKey) {
    const verify = crypto.createVerify("sha256");
    var ecdh = this.loadAccount(privateKey);
    var ECPublicKey = asn1.define('ECPublicKey', function () {
        this.seq().obj(
            this.key('algorithmIdentifier').seq().obj(
              this.key('publicKeyType').objid({
                '1 2 840 10045 2 1': 'EC'
              }),
              this.key('parameters').objid({
                '1 2 840 10045 3 1 7' : 'prime256v1'
                // '1 3 132 0 10'        : 'secp256k1',
                // '1 3 132 0 34'        : 'secp384r1',
                // '1 3 132 0 35'        : 'secp521r1'
              })
            ),
            this.key('publicKey').bitstr()
        );
    });
    var pemPubKey = ECPublicKey.encode({
        algorithmIdentifier: {
          publicKeyType: 'EC',
          parameters: toOIDArray('1.2.840.10045.3.1.7')//'prime256v1'
        },
        publicKey: { data: ecdh.getPublicKey()}
      }, 'pem', { label: 'PUBLIC KEY'} )
      console.log(pemPubKey);
    // var ECPublicKey = asn1.define('ECPublicKey', function() {
    //     this.seq().obj(
    //       this.key('version').int(),
    //       this.key('privateKey').octstr(),
    //       this.key('parameters').explicit(0).objid().optional(),
    //       this.key('publicKey').explicit(1).bitstr().optional()
    //     );
    //   });
    // var pemKey = ECPrivateKey.encode({
    //     version: new BN(1),
    //     publicKey: ecdh.getPublicKey(),
    //     // OID for brainpoolP512t1
    //     parameters: toOIDArray('1.3.36.3.3.2.8.1.1.14')
    //   }, 'pem', { label: 'EC PRIVATE KEY' });
    verify.update(data);
    return verify.verify(pemPubKey, signature)
    //console.log(verify.verify(publicKey, signature));
}

/**
 * 签名数据
 * 
 * @method signData
 * @param data
 * @param privateKey
 * @return 
 */
Account.prototype.sign = function(data,privateKey) {
    this.loadAccount(privateKey);
    var privateECKey = new ECDSA({
        d: this.ecdh.getPrivateKey(),
        x: this.ecdh.getPublicKey().slice(1, Math.ceil(256 / 8) + 1),
        y: this.ecdh.getPublicKey().slice(Math.ceil(256 / 8) + 1)
    })
    var signature = privateECKey.sign(data)
    return signature;
    
}
/**
 * 签名数据
 * 
 * @method signData
 * @param data
* @param signature
 * @param privateKey
 * @return 
 */
Account.prototype.verify = function(data, signature, privateKey) {
    this.loadAccount(privateKey);
    var publicKey = new ECDSA({
        x: this.ecdh.getPublicKey().slice(1, Math.ceil(256 / 8) + 1),
        y: this.ecdh.getPublicKey().slice(Math.ceil(256 / 8) + 1)
    });
    var result = publicKey.verify(data, signature);
    return result;
}


Account.prototype.privateKeyToAccount = function(privateKey, ignoreLength) {
    if (!privateKey.startsWith('0x')) {
        privateKey = '0x' + privateKey;
    }

    // 64 hex characters + hex-prefix
    if (!ignoreLength && privateKey.length !== 66) {
        throw new Error("Private key must be 32 bytes long");
    }

    return this.loadAccount(privateKey);
};


module.exports = Account;