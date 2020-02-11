"use strict";

var version = require('../package.json').version;
var Account = require('./account')
var Keystore = require('./keystore')
var Transation = require('./transaction')
var RequestManager = require('./requestManager')
var HttpProvider = require('./http/httpprovider');

var Joinchain = function Joinchain(provider) {
    var _this = this;
    this.version = version;
    this.currentProvider = provider;
    this.Account = new Account();
    this.Transation = new Transation();
    this.Keystore = new Keystore();
    this.RequestManager = new RequestManager(provider);
    this.providers = {
        HttpProvider: HttpProvider
    };
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
    RequestManager: RequestManager,
    Transation: Transation
};

module.exports = Joinchain;