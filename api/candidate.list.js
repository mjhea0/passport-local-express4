const ipfs = require('../ipfs/ipfs');
const hec = require('../hec/hec.api');
const fs = require('fs');

// 문제 : IPFS로 다운받으면 해쉬값으로 저장됨
// 저장한 다음에 IPFS 해쉬값으로 이름 변경
//

const args = [process.argv[2], // electionAddress
    process.argv[3], // voterAddress
    process.argv[4], // total
    process.argv[5]  // dir
];

// 이전에 생성해놨는지 확인
if(!fs.existsSync('./hec/data/candidate/'+args[3])) {
    // 후보자 목록 파일들 저장
    hec.encryptCandidateList(...args, () => {

        // fileList 만들고
        const total = parseInt(args[2]);
        let fileList = [];
        for (let i = 0; i < total; i++) {
            fileList.push({
                path: `./hec/data/candidate/${args[0]}-${i}-${args[1]}.txt`,
                content: new Buffer.from(path)
            })
        }

        // IPFS에 저장
        return ipfs.files.add(fileList, (err, res) => {
            console.log(res);
            // 파일명 해쉬값으로 변경
            for (let i = 0; i < total; i++) {
                fs.renameSync(`./hec/data/candidate/${args[0]}-${i}-${args[1]}.txt`,
                    './hec/data/candidate/' + res[i].hash)
            }
            // 파일 저장
            const byte = fs.writeFileSync(`./hec/data/candidate/${args[0]}/${args[1]}`, res.toString());
            if(byte > 0) {
                console.log("good!!");
            } else {
                console.log("error!");
            }
        });
    });
}