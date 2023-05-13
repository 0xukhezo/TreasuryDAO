  // SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../GovHelper.sol";
import "./IGovHelperDeployer.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";


contract GovHelperDeployer is IGovHelperDeployer {

    AggregatorV3Interface public immutable priceFeedUsdc;
    IPoolAddressesProvider public immutable poolAddressProvider;
    ISwapRouter public immutable swapRouter;
 
    constructor(
        IPoolAddressesProvider _poolAddressProvider,
        ISwapRouter _swapRouter,
        AggregatorV3Interface _priceFeedUsdc
    ) {
        poolAddressProvider = _poolAddressProvider;
        swapRouter = _swapRouter;
        priceFeedUsdc = _priceFeedUsdc;
    } 


    function deploy() external override returns (GovHelper) {
        return
            new GovHelper(poolAddressProvider,swapRouter,priceFeedUsdc);
    }
    
}

    