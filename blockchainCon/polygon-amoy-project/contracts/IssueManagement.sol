pragma solidity ^0.8.18;

contract IssueManagement {
    // Structure to store issue details
    struct Issue {
        uint issueId;
        string issueName;
        string description;
        string dateOfComplaint;
        uint approvalVotes;
        uint denialVotes;
        Location location;
        address creator;
        bool resolved;
        mapping(address => bool) hasVoted; // Track if an address has voted
    }

    // Structure to store location details
    struct Location {
        uint accuracy;
        int altitude;
        int latitude;
        int longitude;
    }

    // Array to store issues
    Issue[] public issues;

    // Events
    event IssueCreated(uint issueId, string issueName, string description, string dateOfComplaint, address creator);
    event IssueResolved(uint issueId);
    event VoteCast(uint issueId, address voter, bool approved);

    // Function to create an issue
    function createIssue(
        uint _issueId,
        string memory _issueName,
        string memory _description,
        string memory _dateOfComplaint,
        uint _approval,
        uint _denial,
        uint _accuracy,
        int _altitude,
        int _latitude,
        int _longitude
    ) public {
        issues.push();
        Issue storage newIssue = issues[issues.length - 1];
        newIssue.issueId = _issueId;
        newIssue.issueName = _issueName;
        newIssue.description = _description;
        newIssue.dateOfComplaint = _dateOfComplaint;
        newIssue.approvalVotes = _approval;
        newIssue.denialVotes = _denial;
        newIssue.location = Location({
            accuracy: _accuracy,
            altitude: _altitude,
            latitude: _latitude,
            longitude: _longitude
        });
        newIssue.creator = msg.sender;
        newIssue.resolved = false;

        emit IssueCreated(_issueId, _issueName, _description, _dateOfComplaint, msg.sender);
    }

    // Function to vote on an issue
    function voteOnIssue(uint _issueId, bool _approve) public {
        require(_issueId < issues.length, "Invalid issue ID");
        Issue storage issue = issues[_issueId];
        require(!issue.resolved, "Issue already resolved");
        require(!issue.hasVoted[msg.sender], "You have already voted");
        
        if (_approve) {
            issue.approvalVotes++;
        } else {
            issue.denialVotes++;
        }
        
        issue.hasVoted[msg.sender] = true;
        emit VoteCast(_issueId, msg.sender, _approve);
    }

    // Function to resolve an issue
    function resolveIssue(uint _issueId) public {
        require(_issueId < issues.length, "Invalid issue ID");
        Issue storage issue = issues[_issueId];
        require(!issue.resolved, "Issue already resolved");
        
        issue.resolved = true;
        emit IssueResolved(_issueId);
    }

    function getAllIssues() public view returns (
        uint[] memory, string[] memory, string[] memory, uint[] memory, uint[] memory, int[] memory, int[] memory
    ) {
        uint length = issues.length;
        uint[] memory issueIds = new uint[](length);
        string[] memory names = new string[](length);
        string[] memory descriptions = new string[](length);
        uint[] memory approvals = new uint[](length);
        uint[] memory denials = new uint[](length);
        int[] memory latitudes = new int[](length);
        int[] memory longitudes = new int[](length);
       

        for (uint i = 0; i < length; i++) {
            issueIds[i] = issues[i].issueId;
            names[i] = issues[i].issueName;
            descriptions[i] = issues[i].description;
            approvals[i] = issues[i].approvalVotes;
            denials[i] = issues[i].denialVotes;
            latitudes[i] = issues[i].location.latitude;
            longitudes[i] = issues[i].location.longitude;
        
        }

        return (issueIds, names, descriptions, approvals, denials, latitudes, longitudes);
    }

    function getIssueCount() public view returns (uint) {
        return issues.length;
    }

    function getIssueById(uint _issueId) public view returns (
        uint issueId,
        string memory issueName,
        string memory description
    ) {
        for (uint i = 0; i < issues.length; i++) {
            if (issues[i].issueId == _issueId) {
                return (
                    issues[i].issueId,
                    issues[i].issueName,
                    issues[i].description
                );
            }
        }
        revert("Issue not found");
    }
}
