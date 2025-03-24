// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ContractTracking {
    enum ContractStatus { Pending, Ongoing, Completed }

    struct Contract {
        uint256 contractId;
        uint256 tenderId;
        address contractor;
        string contractorMongoId;
        uint256 contractAmount;
        uint256 usedFunds;
        uint256 remainingFunds;
        ContractStatus status;
    }

    struct PaymentRequest {
        uint256 requestId;
        uint256 contractId;
        uint256 amount;
        bool isApproved;
    }

    uint256 private contractCounter;
    uint256 private requestCounter;
    mapping(uint256 => Contract) public contracts;
    mapping(uint256 => PaymentRequest[]) public paymentRequests; // Maps contractId to payment requests

    event ContractCreated(uint256 contractId, uint256 tenderId, address contractor);
    event PaymentRequested(uint256 requestId, uint256 contractId, uint256 amount);
    event PaymentApproved(uint256 requestId, uint256 contractId, uint256 amount);
    event ContractCompleted(uint256 contractId);

    function createContract(
        uint256 _tenderId,
        address _contractor,
        string memory _contractorMongoId,
        uint256 _contractAmount
    ) public {
        contractCounter++;
        contracts[contractCounter] = Contract({
            contractId: contractCounter,
            tenderId: _tenderId,
            contractor: _contractor,
            contractorMongoId: _contractorMongoId,
            contractAmount: _contractAmount,
            usedFunds: 0,
            remainingFunds: _contractAmount,
            status: ContractStatus.Pending
        });

        emit ContractCreated(contractCounter, _tenderId, _contractor);
    }

    function requestPayment(uint256 _contractId, uint256 _amount) public {
        require(contracts[_contractId].contractor == msg.sender, "Only contractor can request payment");
        require(contracts[_contractId].remainingFunds >= _amount, "Insufficient remaining funds");

        requestCounter++;
        paymentRequests[_contractId].push(PaymentRequest({
            requestId: requestCounter,
            contractId: _contractId,
            amount: _amount,
            isApproved: false
        }));

        emit PaymentRequested(requestCounter, _contractId, _amount);
    }

    function approvePayment(uint256 _contractId, uint256 _requestId) public {
        PaymentRequest[] storage requests = paymentRequests[_contractId];
        bool found = false;

        for (uint256 i = 0; i < requests.length; i++) {
            if (requests[i].requestId == _requestId && !requests[i].isApproved) {
                requests[i].isApproved = true;
                contracts[_contractId].usedFunds += requests[i].amount;
                contracts[_contractId].remainingFunds -= requests[i].amount;
                emit PaymentApproved(_requestId, _contractId, requests[i].amount);
                found = true;
                break;
            }
        }
        require(found, "Payment request not found or already approved");
    }

    function completeContract(uint256 _contractId) public {
        require(contracts[_contractId].remainingFunds == 0, "Funds must be fully utilized before completion");
        contracts[_contractId].status = ContractStatus.Completed;
        emit ContractCompleted(_contractId);
    }

    function getContract(uint256 _contractId) public view returns (Contract memory) {
        return contracts[_contractId];
    }
}
