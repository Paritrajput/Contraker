// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HelloWorld {
    string public message;

    constructor() {
        message = "Hello, Polygon Amoy!";
    }

    function updateMessage(string memory newMessage) public {
        message = newMessage;
    }
}
