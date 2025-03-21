// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TenderCreation.sol";

contract Bidding {
    struct Bid {
        uint256 bidId;
        uint256 tenderId;
        address contractor;
        string contractorMongoId; // MongoDB ID of contractor
        uint256 bidAmount;
        string proposalDocument; // IPFS Hash
        uint256 experienceYears;
        uint256 contractorRating;
        bool isApproved;
    }

    struct Contract {
        uint256 contractId;
        uint256 tenderId;
        uint256 winningBidId;
        address contractor;
        string contractorMongoId;
        uint256 contractAmount;
        bool isCompleted;
    }

    uint256 private bidCounter;
    uint256 private contractCounter;
    mapping(uint256 => Bid[]) public tenderBids; // Maps tenderId to an array of bids
    mapping(uint256 => Contract) public contracts; // Maps contractId to contract details

    event BidPlaced(uint256 bidId, uint256 tenderId, string contractorMongoId);
    event BidApproved(uint256 bidId, uint256 tenderId, address contractor);
    event ContractCreated(uint256 contractId, uint256 tenderId, address contractor);

    function placeBid(
        uint256 _tenderId,
        string memory _contractorMongoId,
        uint256 _bidAmount,
        string memory _proposalDocument,
        uint256 _experienceYears,
        uint256 _contractorRating
    ) public {
        bidCounter++;
        tenderBids[_tenderId].push(Bid({
            bidId: bidCounter,
            tenderId: _tenderId,
            contractor: msg.sender,
            contractorMongoId: _contractorMongoId,
            bidAmount: _bidAmount,
            proposalDocument: _proposalDocument,
            experienceYears: _experienceYears,
            contractorRating: _contractorRating,
            isApproved: false
        }));

        emit BidPlaced(bidCounter, _tenderId, _contractorMongoId);
    }

    function approveBid(uint256 _tenderId, uint256 _bidId) public {
        Bid[] storage bids = tenderBids[_tenderId];
        address winningContractor;
        string memory winningMongoId;
        uint256 winningAmount;
        bool bidFound = false;

        for (uint256 i = 0; i < bids.length; i++) {
            if (bids[i].bidId == _bidId) {
                bids[i].isApproved = true;
                winningContractor = bids[i].contractor;
                winningMongoId = bids[i].contractorMongoId;
                winningAmount = bids[i].bidAmount;
                bidFound = true;
                emit BidApproved(_bidId, _tenderId, winningContractor);
                break;
            }
        }
        require(bidFound, "Bid not found");

        // Automatically create contract
        contractCounter++;
        contracts[contractCounter] = Contract({
            contractId: contractCounter,
            tenderId: _tenderId,
            winningBidId: _bidId,
            contractor: winningContractor,
            contractorMongoId: winningMongoId,
            contractAmount: winningAmount,
            isCompleted: false
        });

        emit ContractCreated(contractCounter, _tenderId, winningContractor);
    }

    function getBids(uint256 _tenderId) public view returns (Bid[] memory) {
        return tenderBids[_tenderId];
    }

    function getContract(uint256 _contractId) public view returns (Contract memory) {
        return contracts[_contractId];
    }
}
