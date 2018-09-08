pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./CandidateList.sol";
import "./VoterList.sol";

/**
 * @title 투표
 */

contract Election is Ownable, CandidateList, VoterList {
    using SafeMath for uint;

    /**
     * @dev 선거의 현재 상태
     *      Open : 선거가 막 열렸고, 투표 제안자의 컨펌을 기다리는 상태
     *      Proceed : 선거 투표를 진행하고 있는 상태
     *      Pause : 선거 투표 진행 도중 문제가 생겨 일시정지한 상태
     *      Tally : 투표를 집계 중인 상태
     *      Close : 선거가 종료된 상태
     */
    enum ElectionState {
        Open, Proceed, Pause, Tally, Close
    }
    ElectionState internal electionState;

    string private electionName;
    string private electionDescription;
    bool private finiteElection;
    uint private startDate;
    uint private endDate;
    string private tallyResult;

    // 투표용지(IPFS 해쉬값)
    mapping(address => string) private ballots;
    uint private ballotCount;

    // 동형암호의 공개키(IPFS 해쉬값)
    string private publicKeyOfHe;

    /**
     * @dev 선거 생성자
     * @param _voteName 선거의 이름
     * @param _voteDescription 선거의 설명
     * @param _owner 선거개설자의 주소
     * @param _startDate 선거의 시작 날짜(timestamp)
     * @param _endDate 선거의 종료 날짜(timestamp)
     * @param _finiteElection 유권자가 한정된 선거인지 아닌지
     */
    constructor(
        string _voteName,
        string _voteDescription,
        address _owner,
        uint _startDate,
        uint _endDate,
        bool _finiteElection
    )
    public
    {
        owner = _owner;
        electionName = _voteName;
        electionDescription = _voteDescription;
        startDate = _startDate;
        endDate = _endDate;
        finiteElection = _finiteElection;
        electionState = ElectionState.Open;
    }

    /**
     * @dev 파라미터의 주소가 이 선거의 주인 주소인지 확인하는 메소드
     * @param accountAddress 계정 주소
     * @return 계정 주소가 이 선거의 주인 주소가 맞으면 true
     */
    function isOwner(address accountAddress) external view returns (bool) {
        return accountAddress == owner;
    }

    /**
     * @dev 선거의 주인 계정의 주소를 반환하는 메소드
     * @return 선거 계정의 주소
     */
    function getOwner() external view returns (address) {
        return owner;
    }

    /**
     * @dev 유권자가 한정된 선거인지를 반환하는 메소드
     * @return 한정된 선거면 true
     */
    function isFiniteElection() external view returns (bool) {
        return finiteElection;
    }

    /**
     * @dev 선거의 집계 결과를 반환하는 메소드
     * @return 선거 집계 결과
     */
    function getTallyResult() external view returns (string) {
        return tallyResult;
    }

    /**
     * @dev 투표용지의 수을 얻는 메소드
     * @return 투표용지의 수
     */
    function getBallotCount() external view returns (uint) {
        return ballotCount;
    }

    /**
     * @dev 공개키의 IPFS 해쉬값을 얻는 메소드
     * @return 공개키의 IPFS 해쉬값
     */
    function getPublicKeyOfHe() external view returns (string) {
        return publicKeyOfHe;
    }


    /**
     * @dev 현재 선거의 요약 정보를 얻는 메소드
     * @return 현재 선거의 요약 정보를 반환
     */
    function getElectionSummary() external view returns (
        string,
        string,
        uint,
        uint,
        uint,
        uint,
        bool
    ) {
        return (
            electionName,
            electionDescription,
            uint(electionState),
            startDate,
            endDate,
            ballotCount,
            finiteElection
        );
    }

    /**
     * @dev 선거의 설명을 변경하는 메소드
     * @param _description 변경할 선거의 설명
     */
    function setElectionDescription(string _description) public onlyOwner {
        electionDescription = _description;
    }

    /**
     * @dev 선거의 상태를 변경하는 메소드
     * @param _electionState 변경할 선거의 상태
     */
    function setElectionState(uint _electionState) public onlyOwner {
        require(_electionState < uint(ElectionState.Tally));
        electionState = ElectionState(_electionState);
    }

    /**
     * @dev 선거 진행 날짜 설정
     * @param _startDate 변경할 시작 날짜
     * @param _endDate 변경할 끝낼 날짜
     */
    function setElectionDate(uint _startDate, uint _endDate) public onlyOwner {
        startDate = _startDate;
        endDate = _endDate;
    }

    /**
     * @dev 동형암호 공개키의 IPFS 해쉬값을 설정하는 메소드
     * @param _publicKeyOfHe 변경할 동형암호 공개키(IPFS 해쉬값)
     */
    function setPublicKeyOfHe(string _publicKeyOfHe) public onlyOwner {
        publicKeyOfHe = _publicKeyOfHe;

    /**
     * @dev 선거의 집계 결과를 설정하는 메소드
     * @param _tallyResult 설정할 집계 결과
     */
    function setTallyResult(string _tallyResult) public onlyOwner {
        require(electionState == ElectionState.Tally);
        tallyResult = _tallyResult;
    }

    /**
     * @dev 선거 진행 날짜 사이의 투표일 경우만 투표를 진행할 수 있음
     *      유권자가 한정된 투표면 화이트 리스트에 등록된 계정인지 검사하고,
     *      아닐 경우 넘어간 뒤, 투표용지 해쉬값을 저장함 voterList에 등록합니다.
     *      그 후 유권자를 투표를 한 상태로 변경한 뒤 투표용지의 수를 1 증가합니다.
     * @param _voterAddress 투표를 진행할 계정의 주소
     * @param _ballotHash 투표용지 해쉬값
     */
    function vote(
        address _voterAddress,
        string _ballotHash
    )
    onlyVoterListed(finiteElection)
    onlyOwner
    public
    {
        require(endDate >= now && startDate <= now);

        if (getVoterState(_voterAddress) != uint(VoterState.Voted)) {
            ballots[_voterAddress] = _ballotHash;
            setVoted(_voterAddress);
            ballotCount++;
        }
    }
}
