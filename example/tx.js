var Tx = require('../src/tx/transaction')
var utils = require('../src/utils/utils')
var rawTx = {
    from:"0x81Bec015B1BC1Dc4d088562896F5C62f93cBD5E4",
    nonce: utils.toHex(0),
    gasPrice: utils.toHex(0),
    gas:  utils.toHex("90000"),
    to: "0x5f77f06dce38bdf83766f48db47f86b86d844132",
    value: utils.toHex(utils.toWei(10,"ether")),
    chainId:2018
}
var tx = new Tx(rawTx);
//console.log(tx);
tx.sign("82fa168b8923796fc8fac79b8c9ce63dd40a0f8d23000c3d2441dbf075e84398");
var res = tx.verifySignature("82fa168b8923796fc8fac79b8c9ce63dd40a0f8d23000c3d2441dbf075e84398")
console.log("验证结果："+res);
//console.log(tx);
//var serializedTx = tx.serialize();
//console.log("0x" + serializedTx.toString('hex'));