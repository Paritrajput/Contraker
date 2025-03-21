pragma solidity ^0.8.18;

contract ApprovedContract {
    struct Winner {
        uint256 issueId;
        uint256 contractorId;
        uint256 projectId;
        string name;
        uint256 tenure;
        uint256 amount;
        string location;
        string verifiedBy;
        string approvedBy;
    }

    Winner public winner;
    bool public winnerSet = false;

    // Event to announce the winning contractor
    event WinnerDeclared(
        uint256 issueId,
        uint256 contractorId,
        uint256 projectId,
        string name,
        uint256 tenure,
        uint256 amount,
        string location,
        string verifiedBy,
        string approvedBy
    );

    modifier onlyOnce() {
        require(!winnerSet, "Winner is already set!");
        _;
    }

    function setWinner(
        uint256 _issueId,
        uint256 _contractorId,
        uint256 _projectId,
        string memory _name,
        uint256 _tenure,
        uint256 _amount,
        string memory _location,
        string memory _verifiedBy,
        string memory _approvedBy
    ) public onlyOnce {
        winner = Winner({
            issueId: _issueId,
            contractorId: _contractorId,
            projectId: _projectId,
            name: _name,
            tenure: _tenure,
            amount: _amount,
            location: _location,
            verifiedBy: _verifiedBy,
            approvedBy: _approvedBy
        });
        winnerSet = true;
        emit WinnerDeclared(_issueId, _contractorId, _projectId, _name, _tenure, _amount, _location, _verifiedBy, _approvedBy);
    }

    function getWinner() public view returns (Winner memory) {
        return winner;
    }
}