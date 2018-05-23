pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./Candidatelist.sol";
import "./Voterlist.sol";

/**
 * @title 투표
 */

contract Vote is Ownable, Candidatelist, Voterlist {
    using SafeMath for uint;

    /**
     * @dev 투표의 현재 상태
     *      Open : 투표가 막 열렸고, 투표 제안자의 컨펌을 기다리는 상태
     *      Proceed : 투표를 진행하고 있는 상태
     *      Pause : 투표 진행 도중 문제가 생겨 일시정지한 상태
     *      Close : 투표가 종료된 상태
     */
    enum VoteState {
        Open, Proceed, Pause, Close
    }
    VoteState internal voteState;

    string private voteName;
    bool private isPrivate;
    uint private startDate;
    uint private endDate;
    uint private numVotedVoters;

    /**
     * @dev 투표 생성자
     * @param _voteName 투표의 이름
     * @param _owner 투표 제안자의 주소
     */
    constructor(
        string _voteName,
        address _owner,
        uint _startDate,
        uint _endDate,
        bool _isPrivate
    )
    public
    {
        owner = _owner;
        voteName = _voteName;
        startDate = _startDate;
        endDate = _endDate;
        isPrivate = _isPrivate;
        voteState = VoteState.Open;
    }

    /**
     * @dev 투표를 한 사람의 수을 얻는 메소드
     * @return 투표자의 수
     */
    function getNumVotedVoters() external view returns (uint) {
        return numVotedVoters;
    }

    /**
     * @dev 투표가 private인지 public인지를 얻는 메소드
     * @return isPrivate
     */
    function isPrivateVote() external view returns (bool) {
        return isPrivate;
    }

    /**
     * @dev 현재 투표의 요약 정보를 얻는 메소드
     * @return 현재 투표의 요약 정보를 반환
     */
    function getVoteSummary() external view returns (
        string,
        uint,
        uint,
        uint
    ) {
        return (
        voteName,
        uint(voteState),
        startDate,
        endDate
        );
    }

    /**
     * @dev 투표 상태 설정
     * @param _voteState 설정할 투표 상태
     * @return success 성공하면 true, 실패하면 false
     */
    function setVoteState(uint _voteState) public onlyOwner returns (bool success) {
        require(uint(VoteState.Close) >= _voteState);
        voteState = VoteState(_voteState);
        success = true;
    }

    /**
     * @dev 투표 날짜 설정
     * @param _startDate 변경할 시작 날짜
     * @param _endDate 변경할 끝낼 날짜
     * @return success 성공하면 true, 실패하면 false
     */
    function setDate(uint _startDate, uint _endDate) public onlyOwner returns (bool success){
        require(now <= _startDate && _startDate <= _endDate && now <= _endDate);

        startDate = _startDate;
        endDate = _endDate;
        success = true;
    }

    /**
     * @dev Private면 화이트 리스트에 등록된 계정이 있는지 검사하고,
     *      계정이 있으면 후보자의 득표 수를 1 증가시키고
     *      voters에 등록한다.
     * @param _candidateIndex 투표할 후보 인덱스
     */
    function voting(uint _candidateIndex) onlyVoterlisted(isPrivate) public {
        require(endDate >= now && startDate <= now);

        if (getVoterState(msg.sender) != uint(VoterState.Voted)) {
            if (voteCandidate(_candidateIndex)) {
                if (setVoted(msg.sender)) {
                    numVotedVoters++;
                }
            }
        }
    }
}
