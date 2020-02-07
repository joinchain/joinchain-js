'use strict';

//function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = require('./util');
var fees = require('./params');
var BN = util.BN;

// secp256k1n/2
var N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16);

/**
 * Creates a new transaction object.
 *
 * @example
 * var rawTx = {
 *   nonce: '00',
 *   gasPrice: '09184e72a000',
 *   gasLimit: '2710',
 *   to: '0000000000000000000000000000000000000000',
 *   value: '00',
 *   data: '7f7465737432000000000000000000000000000000000000000000000000000000600057',
 *   v: '1c',
 *   r: '5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
 *   s: '5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13'
 * };
 * var tx = new Transaction(rawTx);
 *
 * @class
 * @param {Buffer | Array | Object} data a transaction can be initiailized with either a buffer containing the RLP serialized transaction or an array of buffers relating to each of the tx Properties, listed in order below in the exmple.
 *
 * Or lastly an Object containing the Properties of the transaction like in the Usage example.
 *
 * For Object and Arrays each of the elements can either be a Buffer, a hex-prefixed (0x) String , Number, or an object with a toBuffer method such as Bignum
 *
 * @property {Buffer} raw The raw rlp encoded transaction
 * @param {Buffer} data.nonce nonce number
 * @param {Buffer} data.gasLimit transaction gas limit
 * @param {Buffer} data.gasPrice transaction gas price
 * @param {Buffer} data.to to the to address
 * @param {Buffer} data.value the amount of ether sent
 * @param {Buffer} data.data this will contain the data of the message or the init of a contract

 * */
// * @param {Buffer} data.v EC signature parameter
//* @param {Buffer} data.r EC signature parameter
// * @param {Buffer} data.s EC recovery ID
// * @param {Number} data.chainId EIP 155 chainId - mainnet: 1, ropsten: 3

var Transaction = function () {
  function Transaction(data) {
    //_classCallCheck(this, Transaction);

    data = data || {};
    // Define Properties
    var fields = [{
      name: 'from',
      length: 20,
      allowLess: true,
      default: new Buffer([])
    },{
      name: 'to',
      allowZero: true,
      length: 20,
      default: new Buffer([])
    }, {
      name: 'nonce',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 'gasLimit',
      alias: 'gas',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 'gasPrice',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 'value',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 'input',
      allowZero: true,
      default: new Buffer([])
    }, {
      name: 'deadline',
      allowZero: true,
      default: new Buffer([])
    },{
      name: 'signature',
      allowZero: true,
      default: ""
    },{
      name: 'extra',
      allowZero: true,
      default: ""
    }];
    //console.log(this)
    //console.log(fields)
    //console.log(data)
    // 赋值字段 并序列化 attached serialize
    util.defineProperties(this, fields, data);

    //console.log(this.raw)
    /**
     * @property {Buffer} from (read only) sender address of this transaction, mathematically derived from other parameters.
     * @name from
     * @memberof Transaction
     */
    // 向对象添加属性，或修改现有属性的属性。
    // Object.defineProperty(this, 'from', {
    //   enumerable: true,
    //   configurable: true,
    //   get: this.getSenderAddress.bind(this)
    // });

    // calculate chainId from signature
    //var sigV = util.bufferToInt(this.v);
   // var chainId = Math.floor((sigV - 35) / 2);
   // if (chainId < 0) chainId = 0;

    // set chainId
    //this._chainId = chainId || data.chainId || 0;
    this._homestead = true;
  }

  /**
   * If the tx's `to` is to the creation address
   * @return {Boolean}
   */


  Transaction.prototype.toCreationAddress = function toCreationAddress() {
    return this.to.toString('hex') === '';
  };

  /**
   * Computes a sha3-256 hash of the serialized tx
   * @param {Boolean} [includeSignature=true] whether or not to inculde the signature
   * @return {Buffer}
   */


  Transaction.prototype.hash = function hash(includeSignature) {
    if (includeSignature === undefined) includeSignature = true;
    console.log(this.raw);
    // EIP155 spec:
    // when computing the hash of a transaction for purposes of signing or recovering,
    // instead of hashing only the first six elements (ie. nonce, gasprice, startgas, to, value, data),
    // hash nine elements, with v replaced by CHAIN_ID, r = 0 and s = 0
    //console.log(this.raw);
    var items = void 0;
    // if (includeSignature) {
    //   items = this.raw;
    //   //console.log(items);
    // } else {
    //   if (this._chainId > 0) {
    //     var raw = this.raw.slice();
    //     //this.v = this._chainId;
    //     this.r = 0;
    //     this.s = 0;
    //     items = this.raw;
    //     this.raw = raw;
    //     console.log(222)
    //   } else {
    //     console.log(333);
    //     items = this.raw.slice(0, 6);
    //   }
    // }
    items = this.raw;

    // create hash
    return util.rlphash(items);
  };

  /**
   * returns the public key of the sender
   * @return {Buffer}
   */


  Transaction.prototype.getChainId = function getChainId() {
    return this._chainId;
  };

  /**
   * returns the sender's address
   * @return {Buffer}
   */


  Transaction.prototype.getSenderAddress = function getSenderAddress() {
    if (this._from) {
      return this._from;
    }
    var pubkey = this.getSenderPublicKey();
    this._from = util.publicToAddress(pubkey);
    return this._from;
  };

  /**
   * returns the public key of the sender
   * @return {Buffer}
   */


  Transaction.prototype.getSenderPublicKey = function getSenderPublicKey() {
    if (!this._senderPubKey || !this._senderPubKey.length) {
      if (!this.verifySignature()) throw new Error('Invalid Signature');
    }
    return this._senderPubKey;
  };

  /**
   * 验证签名
   * Determines if the signature is valid
   * @return {Boolean}
   */


  Transaction.prototype.verifySignature = function verifySignature(privateKey) {
    var msgHash = this.hash(true);
    // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
    // if (this._homestead && new BN(this.s).cmp(N_DIV_2) === 1) {
    //   return false;
    // }

    try {
    //   var v = util.bufferToInt(this.v);
    //   if (this._chainId > 0) {
    //     v -= this._chainId * 2 + 8;
    //   }
      //data,signature,privateKey
      this._senderPubKey = util.ecrecover(msgHash, privateKey, this.r, this.s);
    } catch (e) {
        console.log(e);
      return false;
    }

    return !!this._senderPubKey;
  };

  /**
   * sign a transaction with a given a private key
   * @param {Buffer} privateKey
   */


  Transaction.prototype.sign = function sign(privateKey) {
  
    var msgHash = this.hash(true);
    //return msgHash;
    console.log(msgHash.toString("hex"));
    var sig = util.ecsign(msgHash, privateKey);
    //console.log("sign：" +  sig.toString("hex"))
    // if (this._chainId > 0) {
    //   sig.v += this._chainId * 2 + 8;
    // }
    Object.assign(this, sig);
  };

  /**
   * The amount of gas paid for the data in this tx
   * @return {BN}
   */


  Transaction.prototype.getDataFee = function getDataFee() {
    var data = this.raw[5];
    var cost = new BN(0);
    for (var i = 0; i < data.length; i++) {
      data[i] === 0 ? cost.iaddn(fees.txDataZeroGas.v) : cost.iaddn(fees.txDataNonZeroGas.v);
    }
    return cost;
  };

  /**
   * the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)
   * @return {BN}
   */


  Transaction.prototype.getBaseFee = function getBaseFee() {
    var fee = this.getDataFee().iaddn(fees.txGas.v);
    if (this._homestead && this.toCreationAddress()) {
      fee.iaddn(fees.txCreation.v);
    }
    return fee;
  };

  /**
   * the up front amount that an account must have for this transaction to be valid
   * @return {BN}
   */


  Transaction.prototype.getUpfrontCost = function getUpfrontCost() {
    return new BN(this.gasLimit).imul(new BN(this.gasPrice)).iadd(new BN(this.value));
  };

  /**
   * validates the signature and checks to see if it has enough gas
   * @param {Boolean} [stringError=false] whether to return a string with a dscription of why the validation failed or return a Bloolean
   * @return {Boolean|String}
   */


  Transaction.prototype.validate = function validate(stringError) {
    var errors = [];
    if (!this.verifySignature()) {
      errors.push('Invalid Signature');
    }

    if (this.getBaseFee().cmp(new BN(this.gasLimit)) > 0) {
      errors.push(['gas limit is too low. Need at least ' + this.getBaseFee()]);
    }

    if (stringError === undefined || stringError === false) {
      return errors.length === 0;
    } else {
      return errors.join(' ');
    }
  };

  return Transaction;
}();

module.exports = Transaction;