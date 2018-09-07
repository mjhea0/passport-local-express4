pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title 후보리스트
 */
contract CandidateList is Ownable {

    struct Candidate {
        string name;
        string commitment;
    }
    Candidate[] internal candidates;

    /**
     * @dev 후보자리스트에 후보자를 추가하는 메소드
     * @param _candidateName 후보자의 이름
     * @param _commitment 후보자의 공약
     * @return success 성공하면 true, 실패하면 false
     */
    function addCandidate(string _candidateName, string _commitment) public onlyOwner returns (bool success){
        candidates.push(Candidate(_candidateName, _commitment));
        success = true;
    }

    /**
     * @dev 후보자리스트에서 후보자를 제거하는 메소드
     * @param _candidateIndex 후보자의 인덱스
     * @return success 성공하면 true, 실패하면 false
     */
    function removeCandidate(uint _candidateIndex) public onlyOwner returns (bool success){
        if (0 <= _candidateIndex && _candidateIndex < candidates.length) {

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
        string
    ) {
        require(_candidateIndex < candidates.length);

        return (
            candidates[_candidateIndex].name,
            candidates[_candidateIndex].commitment
        );
    }

    /**
     * @dev 후보자 길이를 얻는 메소드
     * @return 후보자 리스트의 길이를 반환
     */
    function getCandidateLength() external view returns(uint) {
        return candidates.length;
    }
}
