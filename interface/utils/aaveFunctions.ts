// export async function createProposalOpenPositionAAVE(tokenId: string, liquidity: string, nonFungiblePositionManager: INonfungiblePositionManager,timelock: TimelockController) {
//     let callDatas = []
//     let targets = []
//     let values = []
  
//     const paramClose: INonfungiblePositionManager.DecreaseLiquidityParamsStruct = {
//       tokenId: tokenId,
//       liquidity: liquidity,
//       amount0Min: "0",
//       amount1Min: "0",
//       deadline: Math.floor(Date.now() + 10000)
//     }
  
//     callDatas.push(nonFungiblePositionManager.interface.encodeFunctionData('decreaseLiquidity', [paramClose]))
//     targets.push(nonFungiblePositionManager.address)
//     values.push('0')
  
//     const paramCollect: INonfungiblePositionManager.CollectParamsStruct = {
//       tokenId: tokenId,
//       recipient: timelock.address,
//       amount0Max: maxUint128,
//       amount1Max: maxUint128
//     }
  
//     console.log(paramCollect)
  
//     callDatas.push(nonFungiblePositionManager.interface.encodeFunctionData('collect', [paramCollect]))
//     targets.push(nonFungiblePositionManager.address)
//     values.push('0')
  
//     const descriptionHash = `# Close Uniswap Position \n Collect and close position`
  
//     return { callDatas, targets, values, descriptionHash }
//   }