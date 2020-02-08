"use strict";

var version = require('../package.json').version;
var Account = require('./account')
var Keystore = require('./keystore')
//var Tx = require('./transaction')
var RequestManager = require('./requestManager')
var HttpProvider = require('./http/httpprovider');

var Joinchain = function Joinchain(provider) {
    var _this = this;
    this.version = version;
    this.currentProvider = provider;
    this.Account = new Account();
    this.Keystore = new Keystore();
    this.RequestManager = new RequestManager(provider);
    this.providers = {
        HttpProvider: HttpProvider
    };
   // this.Tx = new Tx();

};
Joinchain.version = version;
Joinchain.providers = {
    HttpProvider: HttpProvider
};

Joinchain.prototype.setProvider = function (provider) {
    this.RequestManager.setProvider(provider);
    this.currentProvider = provider;
};

Joinchain.prototype.isConnected = function(){
    return (this.currentProvider && this.currentProvider.isConnected());
};
Joinchain.modules = {
    Account:    Account,
    Keystore:   Keystore,
    HttpProvider:    HttpProvider,
    RequestManager: RequestManager
};

module.exports = Joinchain;