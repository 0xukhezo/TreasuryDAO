// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {GovToken} from "./../GovToken.sol";
import {Gov} from "./../Gov.sol";

interface IGovDeployer {
    function deploy(
        GovToken _token,
        TimelockController _timelock,
        string memory _name,
        uint256 _votingDelay,
        uint256 _votingPeriod,
        uint256 _quorumNumerator,
        uint256 _proposalThreshold
    ) external returns (Gov);
}
