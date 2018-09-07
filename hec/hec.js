const execSync = require('child_process').execSync;
const fs = require('fs');

class Hec {
    /**
     * 공개키와 비밀키 파일들을 만드는 API
     *
     * @param {string} o 선거 컨트렉트 주소
     * @param {int} p 후보자의 수(소수)
     * @param {int} L 레벨
     * @param {string} dir 실행 파일의 디렉토리
     * @param {function} cb exec 처리가 끝난 후의 콜백 함수
     */
    static async createKeys(o, p=13, L=3, dir='data', cb) {
        const command = `./createKeys o=${o} p=${p} L=${L} dir=${dir}`;
        console.debug(command);

        const { stdout, stderr } = execSync(command);

        if(stderr) {
            console.log("error!");
            console.error(stderr);
            return;
        }
        console.debug(stdout);

        await cb();
    }

    /**
     * 후보자 벡터 파일들을 만드는 API
     *
     * @param {string} o 선거 컨트렉트 주소
     * @param {int} t 후보자의 수
     * @param {function} cb exec 처리가 끝난 후의 콜백 함수
     */
    static encryptCandidateList(o, t, cb) {
        const command = `./hec/encrypt_candidate_list o=${o} t=${t}`;
        console.debug(command);
        exec(command, function callback(error, stdout, stderr){
            if(error) console.error(stderr);
            console.debug(stdout);
            cb();
        });
    }

    /**
     * 투표를 최종 집계하는 API
     * 집계 결과를 반환함
     *
     * @param {string} o 선거 컨트렉트 주소
     * @param {int} n 후보자의 수
     * @return {Array} 집계 결과
     * @param {function} cb exec 처리가 끝난 후의 콜백 함수
     */
    static tally(o, n, cb) {
        const command = `./hec/tally o=${o} n=${n} d=hec/data/candidate`;
        console.debug(command);

        exec(command, (error, stdout, stderr) => {
            if(error) console.error(stderr);
            console.debug(stdout);
            cb();
        });
    }

    /**
     * 집계 결과를 반환하는 메소드
     *
     * @param {string} o 선거 컨트렉트 주소
     */
    static getResult(o) {
        // 결과 파일 읽고 배열로 변환
        let resultFile;
        try {
            resultFile = fs.readFileSync(`hec/data/result/${o}.txt`, 'utf8');
        } catch (error) {
            console.debug("file not found");
            return undefined;
        }

        const arr = Array.from(resultFile)
            .filter((value) => parseInt(value))
            .map((value) => parseInt(value)-1);
        console.debug(arr);
        return arr;
    }
}

if (typeof module !== 'undefined') {
    module.exports = Hec
}
