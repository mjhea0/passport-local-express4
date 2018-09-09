const execSync = require('child_process').execSync;

const makeEncryptCandidateList = (electionAddress, voterAddress, total, dir, cb) => {
    let out, err;

    const command = `node ./api/canddiate.list.js ${electionAddress} ${voterAddress} ${total} ${dir}`;

    try {
        out = execSync(command).toString();
    } catch (error) {
        err = error;
    } finally {
        cb(err, out);
    }
};

module.exports = {
    makeEncryptCandidateList
};