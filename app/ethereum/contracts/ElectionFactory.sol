pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./Election.sol";

/**
 * @title 투표 팩토리
 * @dev 하나의 투표를 개설하는 컨트렉트
 */

contract ElectionFactory is Ownable {

    address[] private deployedPublicElections;
    address[] private deployedFiniteElections;

    /**
     * @dev 현재 생성된 선거의 주소 목록을 불러옵니다.
     * @param _isFiniteElection true면 유권자가 한정된 선거만 가져옵니다.
     * @return 생성되어 있는 선거의 주소 목록
     */
    function getDeployedElections(bool _isFiniteElection) external view returns (address[]) {
        return _isFiniteElection ? deployedFiniteElections : deployedPublicElections;
    }

    /**
     * @dev 현재 생성된 선거목록의 갯수(길이)을 불러옵니다.
     * @param _isFiniteElection true면 유권자가 한정된 선거의 갯수만 가져옵니다.
     * @return 선거목록의 갯수(길이)
     */
    function getDeployedElectionsLength(bool _isFiniteElection) external view returns (uint) {
        return _isFiniteElection ? deployedFiniteElections.length : deployedPublicElections.length;
    }

    /**
     * @dev 선거 컨트렉트를 생성하는 메소드입니다.
     *      생성한 다음, 유권자가 한정된 선거면 deployedFiniteElections에,
     *      보통 선거면 deployedPublicElections에 저장합니다.
     * @param _electionName 선거 이름
     * @param _electionDescription 선거 설명
     * @param _electionOwner 선거개설자의 주소
     * @param _startDate 선거 시작 날짜(timestamp)
     * @param _endDate 선거 종료 날짜(timestamp)
     * @param _finiteElection true면 한정된 유권자만 투표할 수 있는
     *                        선거를 생성
     */
    function makeNewElection(
        string _electionName,
        string _electionDescription,
        address _electionOwner,
        uint _startDate,
        uint _endDate,
        bool _finiteElection
    )
        public
        onlyOwner
    {
        address newVote = new Election(
            _electionName,
            _electionDescription,
            _electionOwner,
            _startDate,
            _endDate,
            _finiteElection
        );
        if(_finiteElection) {
            deployedFiniteElections.push(newVote);
        } else {
            deployedPublicElections.push(newVote);
        }
    }
}
