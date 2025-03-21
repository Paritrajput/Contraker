
pragma solidity ^0.8.18;

contract TenderCreation {
    struct Tender {
        uint256 tenderId;
        string title;
        string description;
        string category;
        uint256 minBidAmount;
        uint256 maxBidAmount;
        uint256 bidOpeningDate;
        uint256 bidClosingDate;
        string location; // Work location
        string createdByMongoId; // MongoDB ID of government official
        address createdBy; // Ethereum address of government official
        bool isActive;
    }

    uint256 private tenderCounter;
    mapping(uint256 => Tender) public tenders;

    event TenderCreated(uint256 tenderId, string title, string createdByMongoId);

    function createTender(
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _minBidAmount,
        uint256 _maxBidAmount,
        uint256 _bidOpeningDate,
        uint256 _bidClosingDate,
        string memory _location,
        string memory _createdByMongoId
    ) public {
        require(_bidOpeningDate < _bidClosingDate, "Invalid bid dates");

        tenderCounter++;
        tenders[tenderCounter] = Tender({
            tenderId: tenderCounter,
            title: _title,
            description: _description,
            category: _category,
            minBidAmount: _minBidAmount,
            maxBidAmount: _maxBidAmount,
            bidOpeningDate: _bidOpeningDate,
            bidClosingDate: _bidClosingDate,
            location: _location,
            createdByMongoId: _createdByMongoId,
            createdBy: msg.sender,
            isActive: true
        });

        emit TenderCreated(tenderCounter, _title, _createdByMongoId);
    }

    function getTender(uint256 _tenderId) public view returns (Tender memory) {
        return tenders[_tenderId];
    }

    function getAllTenders() public view returns (Tender[] memory) {
        Tender[] memory allTenders = new Tender[](tenderCounter);
        uint256 counter = 0;

        for (uint256 i = 1; i <= tenderCounter; i++) {
            if (tenders[i].isActive) {
                allTenders[counter] = tenders[i];
                counter++;
            }
        }

        // Resize the array to match the number of active tenders
        assembly {
            mstore(allTenders, counter)
        }

        return allTenders;
    }
}
