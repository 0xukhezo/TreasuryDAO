// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Gov} from "./Gov.sol";
import {GovToken} from "./GovToken.sol";
import {IGovDeployer} from "./deployers/IGovDeployer.sol";
import {IGovHelperDeployer} from "./deployers/IGovHelperDeployer.sol";
import {GovHelper} from "./GovHelper.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";

contract GovFactory {

    IGovDeployer immutable govDeployer;
    IGovHelperDeployer immutable govHelperDeployer;
   

    /// @notice Emitted when a DAO is created.
    /// @param sender Address wants to deploy DAO. Is indexed for query event.
    /// @param gov Governor deploy address.
    /// @param timelock Timelock deploy address.
    /// @param token Token deploy address.
    event DAOCreated(
        address indexed sender,
        address gov,
        address timelock,
        address token,
        address helper
    );

    struct Dao {
        Gov gov;
        GovToken token;
        TimelockController timelock;
        GovHelper govHelper;
    }

    address[] public daos;
    mapping(address => Dao) public daoInfo;

    constructor(
        IGovDeployer _govDeployer,
        IGovHelperDeployer _govHelperDeployer
    ) {
        govDeployer = _govDeployer;
        govHelperDeployer = _govHelperDeployer;
    }

    function deployDao(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _timelockDelay,
        string memory _name,
        uint256 _votingDelay,
        uint256 _votingPeriod,
        uint256 _quorumFraction,
        uint256 _proposalThreshold,
        uint256 _premint
    ) public {
        
        GovToken token = new GovToken(_tokenName, _tokenSymbol);
        
        TimelockController timelock = new TimelockController(_timelockDelay, new address[](0), new address[](0),address(this));
        
        Gov gov = govDeployer.deploy(token,timelock,_name,_votingDelay,_votingPeriod,_quorumFraction,_proposalThreshold);

        GovHelper helper = govHelperDeployer.deploy();

        setUpDao(timelock,gov,token,helper,_premint);

        daos.push(address(gov));
        daoInfo[address(gov)] = Dao(gov,token,timelock,helper);

        emit DAOCreated(msg.sender, address(gov), address(timelock), address(token),address(helper));
   
    }

    /// @notice Setup Deployed DAO
    /// @param _timelock Deployed address timelock
    /// @param _gov Deployed address Governor contract
    /// @param _token Deployed address governance token contract
    /// @dev To configure timelock, the admin must be the DAOFactory contract. Once configured it will renonce role to the governor. 
    function setUpDao(
        TimelockController _timelock,
        Gov _gov,
        GovToken _token,
        GovHelper _govHelper,
        uint256 _premint
    ) internal {
        bytes32 proposerRole = _timelock.PROPOSER_ROLE();
        bytes32 executorRole = _timelock.EXECUTOR_ROLE();
        bytes32 adminRole = _timelock.TIMELOCK_ADMIN_ROLE();

        ///As address(this) is admin of timelock, add roles to Governor
        _timelock.grantRole(proposerRole, address(_gov));
        _timelock.grantRole(executorRole, address(_gov));
        _timelock.renounceRole(adminRole, address(this));

        _govHelper.transferOwnership(address(_timelock));

        _token.mint(msg.sender,_premint);
        _token.transferOwnership(address(_timelock));

    }

    function getDaos() public view returns (address[] memory) {
        return daos;
    }
}
