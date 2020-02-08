var joinchain = require('../src/index');

// connect to ganache localhost
const options = {
    // int port of rpc server, default 5080 for http or 5433 for https
    port: 8545,
    // string domain name or ip of rpc server, default '127.0.0.1'
    host: '127.0.0.1',
    // string with default path, default '/'
    path: '/',
    // boolean false to turn rpc checks off, default true
    strict: true
};
// 实例化Joinchain对象
var J = new joinchain();
// jsonrpc 调用参数
var command = { "jsonrpc": "2.0", "method": "eth_accounts", "params": [], "id": 67 };
// 连接
if (J.JsonRPC.connect(options)) {
    // 调用
    J.JsonRPC.call(command, function (err, res) {
        // Did it all work ?
        if (err) { console.log(err); }
        else { console.log(res); }
    })
} else {
    console.log(options.host + options.port + " connect failed.")
}