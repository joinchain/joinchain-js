"use strict"

var Rpc = require("node-json-rpc");

// const options = {
//     // int port of rpc server, default 5080 for http or 5433 for https
//     port: 8545,
//     // string domain name or ip of rpc server, default '127.0.0.1'
//     host: '127.0.0.1',
//     // string with default path, default '/'
//     path: '/',
//     // boolean false to turn rpc checks off, default true
//     strict: true
// };

var JsonRPC = function JsonRPC() {
}

JsonRPC.prototype.connect = function (options) {
    this.client = new Rpc.Client(options)
    if(this.client === null){
        return false
    }
    return true
}

JsonRPC.prototype.call = function (json, cb) {
    if(null == cb){
        throw new Error("callback function can not is empty.");
    }
    this.client.call(json, cb);
}

module.exports = JsonRPC;