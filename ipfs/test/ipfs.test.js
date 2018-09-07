const ipfs = require('../ipfs');
const fs = require('fs');

let testFile = fs.readFileSync("../../.gitignore");
let testBuffer = new Buffer.from(testFile);

ipfs.files.add(testBuffer, (err, file) => {
    if(err) console.log(err);
    console.log(file)
});
// ipfs.files.get('QmTAmtPEDveRDXUbY2R1bVd45LPRtKwKKHz7qC6yXpQFmY', (err, file) => {
//     if(err) console.log(err);
//     console.log(file[0]);
//     console.log(file[0].content.toString('utf8'))
// });
