pragma solidity ^0.8.18;

contract VotingSystem {
    // Structure to store spend details
    struct Spend {
        uint spendId;
        string reason;
        uint totalVotes;
        uint approvalVotes;
        uint denialVotes;
        bool approved;
        bool resolved;
    }

    // Array to store spends
    Spend[] public spends;

    // Events
    event SpendCreated(uint spendId, string reason);
    event SpendVoted(uint spendId, bool approved);

    // Function to create a spend
    function createSpend(uint _spendId, string memory _reason) public {

        spends.push(Spend({
            spendId: _spendId,
            reason: _reason,
            totalVotes: 0,
            approvalVotes: 0,
            denialVotes: 0,
            approved: false,
            resolved: false
        }));
        emit SpendCreated(_spendId, _reason);
    }

    // Function to vote on a spend
    function voteOnSpend(uint _spendId, uint _approvalVotes, uint _denialVotes, uint _totalVotes) public {
        for (uint i = 0; i < spends.length; i++) {
            if (spends[i].spendId == _spendId) {
                require(!spends[i].resolved, "Spend already resolved");
                spends[i].approvalVotes = _approvalVotes;
        spends[i].denialVotes = _denialVotes;
        spends[i].totalVotes = _totalVotes;
        spends[i].resolved = true;

        if (_approvalVotes * 100 / _totalVotes >= 51) {
            spends[i].approved = true;
        } else {
            spends[i].approved = false;
        }

        
        emit SpendVoted(_spendId, spends[i].approved);
        break;
            }
        }
        
    }

    // Function to fetch a spend by spendId
    function getSpendById(uint _spendId) public view returns (
        uint spendId,
        string memory reason,
        uint totalVotes,
        uint approvalVotes,
        uint denialVotes,
        bool approved,
        bool resolved
    ) {
        for (uint i = 0; i < spends.length; i++) {
            if (spends[i].spendId == _spendId) {
                return (
                    spends[i].spendId,
                    spends[i].reason,
                    spends[i].totalVotes,
                    spends[i].approvalVotes,
                    spends[i].denialVotes,
                    spends[i].approved,
                    spends[i].resolved
                );
            }
        }
    }
}