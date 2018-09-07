const hec = require('../../hec/hec.js');
const ipfs = require('../../ipfs/ipfs.js');

const contract = "inputcontract";

// 공개키를 만든 후
hec.createKeys(contract, 10007, 7, async () => {
    // IPFS에 저장합니다
    const publicKeyFilePath = "../../hec/data/publicKey/" + contract + ".bin";
    const publicKeyFile = fs.readFileSync(publicKeyFilePath);

    ipfs.files.add(new Buffer.from(publicKeyFile), async (err, file) => {
        if (err) console.log(err);
        console.debug(file);
        const publicKeyFileHash = file[0].hash;
    });
});
