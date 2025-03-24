// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TenderCreation.sol";

contract Bidding {
    struct Bid {
        uint256 bidId;
        uint256 tenderId;
        address contractor;
        string contractorMongoId;
        uint256 bidAmount;
        string proposalDocument;
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
        uint256 paidAmount;
        bool isCompleted;
    }

    struct PaymentRequest {
        uint256 requestId;
        uint256 contractId;
        uint256 amountRequested;
        bool isApproved;
        bool isRejected;
    }

    uint256 private bidCounter;
    uint256 private contractCounter;
    uint256 private paymentCounter;
    mapping(uint256 => Bid[]) public tenderBids;
    mapping(uint256 => Contract) public contracts;
    Contract[] private allContracts;
    mapping(uint256 => PaymentRequest[]) public paymentRequests; // Maps contractId to payment requests

    event BidPlaced(uint256 bidId, uint256 tenderId, string contractorMongoId);
    event BidApproved(uint256 bidId, uint256 tenderId, address contractor);
    event ContractCreated(uint256 contractId, uint256 tenderId, address contractor);
    event PaymentRequested(uint256 requestId, uint256 contractId, uint256 amountRequested);
    event PaymentApproved(uint256 requestId, uint256 contractId, uint256 amountApproved);
    event PaymentRejected(uint256 requestId, uint256 contractId);

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

        contractCounter++;
        Contract memory newContract = Contract({
            contractId: contractCounter,
            tenderId: _tenderId,
            winningBidId: _bidId,
            contractor: winningContractor,
            contractorMongoId: winningMongoId,
            contractAmount: winningAmount,
            paidAmount: 0,
            isCompleted: false
        });

        contracts[contractCounter] = newContract;
        allContracts.push(newContract);

        emit ContractCreated(contractCounter, _tenderId, winningContractor);
    }

    function requestPayment(uint256 _contractId, uint256 _amount) public {
        require(_amount > 0, "Payment amount must be greater than zero");
        require(contracts[_contractId].contractor == msg.sender, "Only contractor can request payment");
        require(contracts[_contractId].paidAmount + _amount <= contracts[_contractId].contractAmount, "Requested amount exceeds contract value");
        
        paymentCounter++;
        paymentRequests[_contractId].push(PaymentRequest({
            requestId: paymentCounter,
            contractId: _contractId,
            amountRequested: _amount,
            isApproved: false,
            isRejected: false
        }));
        
        emit PaymentRequested(paymentCounter, _contractId, _amount);
    }

    function approvePayment(uint256 _contractId, uint256 _requestId) public {
        PaymentRequest[] storage requests = paymentRequests[_contractId];
        bool requestFound = false;
        uint256 approvedAmount;
        
        for (uint256 i = 0; i < requests.length; i++) {
            if (requests[i].requestId == _requestId && !requests[i].isApproved && !requests[i].isRejected) {
                requests[i].isApproved = true;
                approvedAmount = requests[i].amountRequested;
                contracts[_contractId].paidAmount += approvedAmount;
                
                if (contracts[_contractId].paidAmount == contracts[_contractId].contractAmount) {
                    contracts[_contractId].isCompleted = true;
                }
                
                requestFound = true;
                emit PaymentApproved(_requestId, _contractId, approvedAmount);
                break;
            }
        }
        require(requestFound, "Payment request not found or already processed");
    }

    function rejectPayment(uint256 _contractId, uint256 _requestId) public {
        PaymentRequest[] storage requests = paymentRequests[_contractId];
        bool requestFound = false;
        
        for (uint256 i = 0; i < requests.length; i++) {
            if (requests[i].requestId == _requestId && !requests[i].isApproved && !requests[i].isRejected) {
                requests[i].isRejected = true;
                requestFound = true;
                emit PaymentRejected(_requestId, _contractId);
                break;
            }
        }
        require(requestFound, "Payment request not found or already processed");
    }

    function getBids(uint256 _tenderId) public view returns (Bid[] memory) {
        return tenderBids[_tenderId];
    }

    function getContract(uint256 _contractId) public view returns (Contract memory) {
        return contracts[_contractId];
    }

    function getAllContracts() public view returns (Contract[] memory) {
        return allContracts;
    }
}
