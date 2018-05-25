pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./Vote.sol";

/**
 * @title 투표 팩토리
 * @dev 하나의 투표를 개설하는 컨트렉트
 */

contract VoteFactory is Ownable {

    address[] private deployedPublicVotes;
    address[] private deployedPrivateVotes;

    /**
     * @dev 현재 생성된 투표의 주소 목록을 불러옵니다.
     * @param doPrivateVotes true면 프라이빗만 가져옵니다.
     * @return 생성되어 있는 투표의 주소 목록
     */
    function getDeployedVotes(bool doPrivateVotes) external view returns (address[]) {
        return doPrivateVotes ? deployedPrivateVotes : deployedPublicVotes;
    }

    /**
     * @dev 현재 생성된 투표목록의 길이을 불러옵니다.
     * @param doPrivateVotes true면 프라이빗만 가져옵니다.
     * @return 투표목록의 길이
     */
    function getDeployedVotesLength(bool doPrivateVotes) external view returns (uint) {
        return doPrivateVotes ? deployedPrivateVotes.length : deployedPublicVotes.length;
    }

    /**
     * @dev Private, Public 중 하나를 선택하여 투표를 생성합니다.
     *      생성한 다음 투표 목록(deployedVotes)에 저장
     * @param _voteName 투표 이름
     * @param _voteOwner 투표 제안자의 주소
     * @param _isPrivate true  : private 투표를 생성
     *                   false : public 투표를 생성
     */
    function makeNewVote(
        string _voteName,
        string _voteDescription,
        address _voteOwner,
        uint _startDate,
        uint _endDate,
        bool _isPrivate
    )
        public
        onlyOwner
    {
        address newVote = new Vote(
            _voteName,
            _voteDescription,
            _voteOwner,
            _startDate,
            _endDate,
            _isPrivate
        );
        if(_isPrivate) {
            deployedPrivateVotes.push(newVote);
        } else {
            deployedPublicVotes.push(newVote);
        }
    }
}
