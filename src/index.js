"use strict";

var version = require('../package.json').version;
var Account = require('./account')
var Keystore = require('./keystore')
var Tx = require('./transaction')
var JsonRPC = require('./jsonrpc')

var Joinchain = function Joinchain() {
    var _this = this;
    this.version = version;

    this.Account = new Account();
    this.Keystore = new Keystore();
    this.JsonRPC = new JsonRPC();
   // this.Tx = new Tx();

    // // overwrite package setProvider
    // var setProvider = this.setProvider;
    // this.setProvider = function (provider, net) {
    //     setProvider.apply(_this, arguments);

    //     this.eth.setProvider(provider, net);
    //     this.shh.setProvider(provider, net);
    //     this.bzz.setProvider(provider);

    //     return true;
    // };
};
Joinchain.version = version;
Joinchain.modules = {
    Account:    Account,
    Keystore:   Keystore,
    JsonRPC:    JsonRPC
};

module.exports = Joinchain;