const ipfs = require('../ipfs');
const fs = require('fs');

let testFile = fs.readFileSync("../../.gitignore");
let testBuffer = new Buffer.from(testFile);

// const a = async() => {
//     await ipfs.files.add(testBuffer, (err, file) => {
//         if (err) console.log(err);
//         console.log(file)
//     });
//     console.log("asdfasf");
// };
// a();
// console.log("asdfasf22");

function sleep (delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

const importantFunction = (a, cb) => {
    const val = a + 1;
    cb(val)
};

const problemFunction = () => {
    importantFunction(2, (val) => {
        console.log("네트워크 작업중...");
        sleep(3000);
        console.log("작업을 마침");
    });
    console.log("작업을 마친 후 실행되어야 함");
};
problemFunction();
console.log("problemFunction이 끝난 후에 실행되어야 함");


// ipfs.files.get('QmTAmtPEDveRDXUbY2R1bVd45LPRtKwKKHz7qC6yXpQFmY', (err, file) => {
//     if(err) console.log(err);
//     console.log(file[0]);
//     console.log(file[0].content.toString('utf8'))
// });
