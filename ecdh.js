const ECDHCrypto = require('ecdh-crypto');

// Create a new (random) ECDHCrypto instance using the secp521r1 curve
var randomKey = ECDHCrypto.createECDHCrypto('P-256');
console.log(randomKey.toJSON());