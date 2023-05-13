import {  TimelockController } from "../types/TimelockController"
import { BigNumber } from 'ethers';
import { ERC20 } from '../types/ERC20';
import { INonfungiblePositionManager } from '../types/INonfungiblePositionManager';

const maxUint128 = "340282366920938463463374607431768211455"

export async function createProposalOpenPositionUniswap(timelock:string, amount0Min:string, amount1Min:string, fee:string, token0: ERC20, amount0: BigNumber, token1: ERC20, amount1: BigNumber, nonFungiblePositionManager: INonfungiblePositionManager, tickLower: number, tickUpper:number, title:string, description:string) {
  let callDatas = []
  let targets = []
  let values = []

  callDatas.push(token0.interface.encodeFunctionData('approve', [nonFungiblePositionManager.address, amount0.toString()]))
  targets.push(token0.address)
  values.push('0')

  callDatas.push(token1.interface.encodeFunctionData('approve', [nonFungiblePositionManager.address, amount1.toString()]))
  targets.push(token1.address)
  values.push('0')

  const param: INonfungiblePositionManager.MintParamsStruct = {
    token0: token0.address,
    token1: token1.address,
    fee: fee,
    tickLower: tickLower.toString(),
    tickUpper: tickUpper.toString(),
    amount0Desired: amount0.toString(),
    amount1Desired: amount1.toString(),
    amount0Min: "0",
    amount1Min: "0",
    recipient: timelock,
    deadline: Math.floor(Date.now() + (168*3.6e+6))
  }
  callDatas.push(nonFungiblePositionManager.interface.encodeFunctionData('mint', [param]))
  targets.push(nonFungiblePositionManager.address)
  values.push('0')

  const descriptionHash = `# ${title} \n ${description}`

  return { callDatas, targets, values, descriptionHash }
}

export async function createProposalClosePositionUniswap(tokenId: string, liquidity: string, nonFungiblePositionManager: INonfungiblePositionManager,timelock: TimelockController) {
  let callDatas = []
  let targets = []
  let values = []

  const paramClose: INonfungiblePositionManager.DecreaseLiquidityParamsStruct = {
    tokenId: tokenId,
    liquidity: liquidity,
    amount0Min: "0",
    amount1Min: "0",
    deadline: Math.floor(Date.now() + 10000)
  }

  callDatas.push(nonFungiblePositionManager.interface.encodeFunctionData('decreaseLiquidity', [paramClose]))
  targets.push(nonFungiblePositionManager.address)
  values.push('0')

  const paramCollect: INonfungiblePositionManager.CollectParamsStruct = {
    tokenId: tokenId,
    recipient: timelock.address,
    amount0Max: maxUint128,
    amount1Max: maxUint128
  }

  callDatas.push(nonFungiblePositionManager.interface.encodeFunctionData('collect', [paramCollect]))
  targets.push(nonFungiblePositionManager.address)
  values.push('0')

  const descriptionHash = `# Close Uniswap Position \n Collect and close position`

  return { callDatas, targets, values, descriptionHash }
}