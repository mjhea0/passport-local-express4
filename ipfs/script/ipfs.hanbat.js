const ipfs = require('../ipfs');
const fs = require('fs');
const Election = require('../../ethereum/election');
const contractInformation = require('../../config/contract-address.json');

const contractAddress = contractInformation['test_qkxeo_contract'];
const ownerAddress = contractInformation['test_qkxeo_address'];

const publicKeyFilePath = "./hec/data/publicKey/" + contractAddress + ".bin";
const publicKeyFile = fs.readFileSync(publicKeyFilePath);
let buffer = new Buffer.from(publicKeyFile);

ipfs.files.add(buffer, async (err, res) => {
    if (err) {
        console.log(err);
        return;
    }
    const publicKeyFileHash = res[0].hash;
    await Election(contractAddress).methods
        .setPublicKeyOfHe(publicKeyFileHash).send({from: ownerAddress});
    console.log("good");
});
