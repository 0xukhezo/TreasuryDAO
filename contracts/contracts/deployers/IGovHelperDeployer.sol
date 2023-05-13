// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../GovHelper.sol";

interface IGovHelperDeployer {
    function deploy() external returns (GovHelper);
}
