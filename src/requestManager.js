"use strict";

var Jsonrpc = require("./jsonrpc/jsonrpc");
var errors = require("./http/errors");
//var httpProvider = require('./http/httpprovider')

var RequestManager = function RequestManager(provider) {
    this.provider = provider;
    //this.polls = {};
    this.timeout = null;
}

/**
 * Should be used to synchronously send request
 *
 * @method send
 * @param {string} data
 * @param {any} params
 * @return {Object}
 */
RequestManager.prototype.send = function (method,params) {
    if (!this.provider) {
        console.error(errors.InvalidProvider());
        return null;
    }

    var payload = Jsonrpc.toPayload(method, params);
    var result = this.provider.send(payload);

    if (!Jsonrpc.isValidResponse(result)) {
        throw errors.InvalidResponse(result);
    }

    return result.result;
};

/**
 * Should be used to asynchronously send request
 *
 * @method sendAsync
 * @param {Object} data
 * @param {Function} callback
 */
RequestManager.prototype.sendAsync = function (data, callback) {
    if (!this.provider) {
        return callback(errors.InvalidProvider());
    }

    var payload = Jsonrpc.toPayload(data.method, data.params);
    this.provider.sendAsync(payload, function (err, result) {
        if (err) {
            return callback(err);
        }
        
        if (!Jsonrpc.isValidResponse(result)) {
            return callback(errors.InvalidResponse(result));
        }

        callback(null, result.result);
    });
};

/**
 * Should be called to asynchronously send batch request
 *
 * @method sendBatch
 * @param {Array} batch data
 * @param {Function} callback
 */
RequestManager.prototype.sendBatch = function (data, callback) {
    if (!this.provider) {
        return callback(errors.InvalidProvider());
    }

    var payload = Jsonrpc.toBatchPayload(data);
    console.log(payload);
    this.provider.sendAsync(payload, function (err, results) {
        if (err) {
            return callback(err);
        }
        if (!Array.isArray(results)) {
            return callback(errors.InvalidResponse(results));
        }

        callback(err, results);
    }); 
};

/**
 * Should be used to set provider of request manager
 *
 * @method setProvider
 * @param {Object}
 */
RequestManager.prototype.setProvider = function (p) {
    this.provider = p;
};

module.exports = RequestManager;

// var Httpprovider = new  httpProvider("http://127.0.0.1:8545")

// var request = new RequestManager(Httpprovider);

// //组装数据
// var content = { "jsonrpc": "2.0", "method": "eth_accounts", "params": [], "id": 67 }

//send 方法使用
// var res = request.send(content);
// console.log("send方法结果：\n " + res + '\n');

// //sendSync方法使用
// request.sendAsync(content,function(err,result){
//     if(err){
//         console.log("faild");
//     }
//     console.log("sendAsync方法结果：\n " + result + '\n');
// });

//批量
// var batchContent = [
//     { "jsonrpc": "2.0", "method": "eth_accounts", "params": [], "id": 67 },
//     {"jsonrpc": "2.0","method": "eth_accounts","params": []},
// ]


// request.sendBatch(batchContent, function(err,results){
//     if(err){
//         console.log(err);
//     }
//     console.log(results);
// })