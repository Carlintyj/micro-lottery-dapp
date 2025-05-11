// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract Lottery is AutomationCompatibleInterface {
    address public manager;
    address[] public players;
    uint public lastTimeStamp;
    uint public interval;

    event WinnerPicked(address winner);

    constructor(uint _interval) {
        manager = msg.sender;
        lastTimeStamp = block.timestamp;
        interval = _interval; // e.g., 3600 seconds = 1 hour
    }

    function enter() public payable {
        require(msg.value > 0.01 ether, "Minimum ether not sent");
        players.push(msg.sender);
    }

    // Automation check logic
    function checkUpkeep(
        bytes calldata
    ) external view override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = (players.length > 0 && (block.timestamp - lastTimeStamp) > interval);
        performData = "";
    }

    // Automation execution logic
    function performUpkeep(bytes calldata) external override {
        require((block.timestamp - lastTimeStamp) > interval, "Interval not met");
        require(players.length > 0, "No players");

        uint index = random() % players.length;
        address winner = players[index];
        payable(winner).transfer(address(this).balance);
        delete players; 
        lastTimeStamp = block.timestamp;

        emit WinnerPicked(winner);
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, players)));
    }
}
