// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import '@openzeppelin/contracts/utils/math/SafeCast.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {DataTypes} from "@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

contract GovHelper is Ownable {

    event NaturalPositionCreated(
        address collateralToken,
        uint256 collateralAmount,
        address borrowToken,
        uint256 borrowAmount,
        uint256 interestRateMode
    );

    event NaturalPositionClosed(
        address tokenIn, 
        uint256 amountIn, 
        address borrowToken
    );

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

    function borrowSwap(
        address collateralToken,
        uint256 collateralAmount,
        address borrowToken,
        uint256 borrowAmount,
        uint256 interestRateMode,
        AggregatorV3Interface priceFeed,
        uint24 slippage,
        uint24 poolFee
    ) external onlyOwner {
        
        bool succeededIn = IERC20(collateralToken).transferFrom(_msgSender(),address(this),collateralAmount);
        require(succeededIn, "GovHelper: Failed to transfer collateralAmount");

        address aavePool = poolAddressProvider.getPool();

        IERC20(collateralToken).approve(aavePool, collateralAmount);

        IPool(aavePool).supply(collateralToken,collateralAmount,_msgSender(),0);
    
        IPool(aavePool).borrow(borrowToken,borrowAmount,interestRateMode,0,_msgSender());

        uint256 amountOut = swap(borrowToken,borrowAmount,collateralToken,slippage,poolFee, priceFeed);

        bool succeededOut = IERC20(collateralToken).transfer(_msgSender(),amountOut);

        require(succeededOut, "GovHelper: Failed to transfer amountOut");

        emit NaturalPositionCreated(collateralToken, collateralAmount, borrowToken, borrowAmount, interestRateMode);
        
    }

    function swapRepay(address tokenIn, uint256 amountIn, address borrowToken, uint24 slippage,uint24 poolFee, AggregatorV3Interface priceFeed, uint256 interestRateMode) external onlyOwner() {
        bool succeededIn = IERC20(tokenIn).transferFrom(_msgSender(),address(this),amountIn);
        require(succeededIn, "GovHelper: Failed to transfer amountIn");

        address aavePool = poolAddressProvider.getPool();
        
        DataTypes.ReserveData memory data = IPool(aavePool).getReserveData(borrowToken);
        uint256 debtAmount = IERC20(data.variableDebtTokenAddress).balanceOf(_msgSender());
   
        swap(tokenIn,amountIn,borrowToken,slippage,poolFee, priceFeed);

        IERC20(borrowToken).approve(aavePool, debtAmount);
        IPool(aavePool).repay(borrowToken,debtAmount,interestRateMode,_msgSender());

        uint256 debtAmountAfter = IERC20(data.variableDebtTokenAddress).balanceOf(_msgSender());
        require(debtAmountAfter == 0, "GovHelper: Failed to pay all debt");

        returnLeftOver(tokenIn,borrowToken,slippage,poolFee,priceFeed);

        emit NaturalPositionClosed(tokenIn, amountIn, borrowToken);

    }

    function returnLeftOver(address tokenIn, address borrowToken, uint24 slippage,uint24 poolFee, AggregatorV3Interface priceFeed) internal{
        uint256 amountLeftOver = IERC20(borrowToken).balanceOf(address(this));
        uint256 amountOutLeftOver = swap(borrowToken,amountLeftOver,tokenIn,slippage,poolFee, priceFeed);
        bool succeededOut = IERC20(tokenIn).transfer(_msgSender(), amountOutLeftOver);
        require(succeededOut, "GovHelper: Failed to transfer amountOut");
    }

    function swap(
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint24 slippage,
        uint24 poolFee,
        AggregatorV3Interface priceFeed
    ) internal returns (uint256 amountOut) {
        TransferHelper.safeApprove(tokenIn, address(swapRouter), amountIn);

        uint256 amountExpected = computeExcpectedAmount(priceFeed, amountIn);
        
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: computeSlippage(amountExpected,slippage),
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }


    /// @notice Explain to an end user what this does
    /// @dev Explain to a developer any extra details
    function computeExcpectedAmount(AggregatorV3Interface priceFeed, uint256 borrowAmount) internal view returns (uint256){
        (,int priceUsd,,,) = priceFeed.latestRoundData(); //8 decimals
        (,int priceUsdc,,,) = priceFeedUsdc.latestRoundData(); //6 decimals

        uint256 ethPrice = SafeMath.div(SafeMath.mul(SafeCast.toUint256(priceUsd), 1e6),SafeCast.toUint256(priceUsdc));
        //TODO decimals 1e12
        return SafeMath.div(SafeMath.mul(borrowAmount,SafeMath.div(ethPrice,1e6)),1e12);

    }

    ////@notice Compute minimum amount for a given slippage
    function computeSlippage(uint256 amount, uint24 slippage) internal pure returns (uint256) {
        return SafeMath.sub(amount, SafeMath.div(SafeMath.mul(amount, uint256(slippage)), 10_000));
    }
}
