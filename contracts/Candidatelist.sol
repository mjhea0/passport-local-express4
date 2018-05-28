pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title 후보리스트
 */
contract Candidatelist is Ownable {

    struct Candidate {
        string name;
        string commitment;
        uint numVote;
    }
    Candidate[] internal candidates;

    /**
     * @dev 후보리스트에 후보를 추가하는 메소드
     * @param _candidateName 후보의 이름
     * @return success 성공하면 true, 실패하면 false
     */
    function addCandidate(string _candidateName) public onlyOwner returns (bool success){
        candidates.push(Candidate(_candidateName, '', 0));
        success = true;
    }

    /**
     * @dev 후보리스트에 후보를 추가하는 메소드
     * @param _candidateName 후보의 이름
     * @param _commitment 후보의 공약
     * @return success 성공하면 true, 실패하면 false
     */
    function addCandidate(string _candidateName, string _commitment) public onlyOwner returns (bool success){
        candidates.push(Candidate(_candidateName, _commitment, 0));
        success = true;
    }

    /**
     * @dev 후보리스트에서 후보자를 제거하는 메소드
     * @param _candidateIndex 후보자의 인덱스
     * @return success 성공하면 true, 실패하면 false
     */
    function removeCandidate(uint _candidateIndex) public onlyOwner returns (bool success){
        if (_candidateIndex < candidates.length) {

            for (uint i = _candidateIndex; i<candidates.length-1; i++){
                candidates[i] = candidates[i+1];
            }
            candidates.length--;

            success = true;
        }
    }

    /**
     * @dev 후보자를 얻는 메소드
     * @param _candidateIndex 후보자 인덱스
     * @return 후보자의 이름, 득표 수를 반환
     */
    function getCandidate(uint _candidateIndex) external view returns (
        string,
        string,
        uint
    ) {
        require(_candidateIndex < candidates.length);

        return (
            candidates[_candidateIndex].name,
            candidates[_candidateIndex].commitment,
            candidates[_candidateIndex].numVote
        );
    }

    /**
     * @dev 후보자 길이를 얻는 메소드
     * @return 후보자 리스트의 길이를 반환
     */
    function getCandidateLength() external view returns(uint) {
        return candidates.length;
    }

    /**
     * @dev 후보자에게 투표를 하는 내부 메소드
     * @param _candidateIndex 후보자 리스트의 인덱스
     * @return 성공하면 true
     */
    function voteCandidate(uint _candidateIndex) internal returns(bool success) {
        if(_candidateIndex < candidates.length) {
            candidates[_candidateIndex].numVote++;
            success = true;
        }
    }

    //    /**
//     * @dev 후보리스트를 시작 인덱스부터 끝 인덱스까지 얻는 메소드
//     * @param _startIndex 시작 인덱스
//     * @param _endIndex 끝 인덱스
//     * @return 후보의 이름 리스트, 후보의 득표 리스트를 반환
//     */
//    function getCandidates(uint _startIndex, uint _endIndex) onlyOwner public returns (string[], uint[]) {
//        require(_startIndex < candidates.length && _endIndex < candidates.length);
//        require(_endIndex >= _startIndex);
//
//        if (_startIndex == _endIndex) {
//            return (candidates[_startIndex].name, candidates[_startIndex].num);
//        } else if (_startIndex <= 0 && _endIndex <= 0) {
//            _startIndex = 0;
//            _endIndex = candidates.length;
//        }
//
//        string[] memory names = new string[](_endIndex - _startIndex);
//        uint[] memory numVotes = new uint[](_endIndex - _startIndex);
//
//        for (uint i = _startIndex; i <= _endIndex; i++) {
//            Candidate storage candidate = candidates[i];
//            names[i] = candidate.name;
//            numVotes[i] = candidate.numVote;
//        }
//        return (names, numVotes);
//    }
}
