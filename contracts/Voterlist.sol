pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title 투표자리스트
 */
contract Voterlist is Ownable {
    mapping(address => VoterState) internal voters;
    uint private numVoters;

    /**
     * @dev 투표자의 현재 상태
     *      None : 투표에 참여할 수 없는 상태
     *      Voteable : 투표에 참여할 수 있는 상태
     *      Voted : 투표를 하고 난 상태
     */
    enum VoterState {
        None, Voteable, Voted
    }

    /**
     * @dev 투표자 리스트 검사 모디파이어
     *      프리베이트 투표일 경우 투표자리스트에 있는 사람인지 검사
     */
    modifier onlyVoterlisted(bool isPrivate) {
        if (isPrivate)
            require(voters[msg.sender] == VoterState.Voteable);
        _;
    }
//
//    /**
//     * @dev 투표자 상태 설정
//     * @param _voterAddress 설정할 투표자
//     * @param _voterState 설정할 투표자 상태
//     * @return success 성공하면 true, 실패하면 false
//     */
//    function setVoterState(
//        address _voterAddress,
//        uint _voterState
//    )
//        public
//        onlyOwner
//        returns (bool success)
//    {
//        require(uint(VoterState.Voted) >= _voterState);
//        voters[_voterAddress] = VoterState(_voterState);
//        success = true;
//    }

    /**
     * @dev 투표자리스트에 투표자를 추가하는 메소드
     * @param _voterAddress 투표자의 주소
     * @return success 명단에 넣어지면 true, 이미 있거나 실패하면 false
     */
    function addVoterToVoterlist(address _voterAddress) public onlyOwner returns (bool success) {
        if (voters[_voterAddress] == VoterState.None) {
            voters[_voterAddress] = VoterState.Voteable;
            numVoters++;
            success = true;
        }
    }

    /**
     * @dev 투표자리스트에 투표자를 제거하는 메소드
     * @param _voterAddress 투표자의 주소
     * @return success 투표자가 없으면 삭제하고 true, 있으면 false
     */
    function setVoterStateNoneFromVoters(address _voterAddress) public onlyOwner returns (bool success) {
        if (voters[_voterAddress] == VoterState.Voteable) {
            voters[_voterAddress] = VoterState.None;
            numVoters--;
            success = true;
        }
    }

    /**
     * @dev 프리베이트일 경우, 투표자의 총 수을 얻는 메소드
     * @return 투표자의 수
     */
    function getNumVoters() external view returns(uint) {
        return numVoters;
    }

    /**
     * @dev 투표자의 상태를 얻는 메소드
     * @return 투표자의 상태를 정수로 반환
     */
    function getVoterState(address _voterAddress) public view returns(uint) {
        return uint(voters[_voterAddress]);
    }

    /**
     * @dev 투표자를 투표한 상태로 설정
     * @param _voterAddress 설정할 투표자
     * @return success 성공하면 true, 실패하면 false
     */
    function setVoted(address _voterAddress) internal returns (bool success) {
        voters[_voterAddress] = VoterState.Voted;
        success = true;
    }
}
