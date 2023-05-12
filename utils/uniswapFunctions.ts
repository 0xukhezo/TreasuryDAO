// import { ethers } from 'hardhat'
// import { BigNumber } from "@ethersproject/bignumber";
// import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
// import { UtilsTest } from './UtilsTest'
// import { TestERC20__factory, TestERC20, TimelockController, Gov, TestERC721__factory, TestERC721, GovToken, V3Utils__factory, V3Utils, IERC20, INonfungiblePositionManager__factory, INonfungiblePositionManager, IWETH9 } from "../typechain-types"
// import {  TickMath, SqrtPriceMath, encodeSqrtRatioX96, nearestUsableTick } from '@uniswap/v3-sdk';
import { BigNumber } from 'ethers';
import { ERC20 } from '../types/ERC20';
import { INonfungiblePositionManager } from '../types/INonfungiblePositionManager';

const maxUint128 = "340282366920938463463374607431768211455"

// const initialBalanceUsdc = ethers.utils.parseUnits("10000", "6");
// const initialBalanceWeth = ethers.utils.parseEther("100")

const usdcAddr = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const wethAddr = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1";
const nonFungiblePositionManagerAddr='0xC36442b4a4522E871399CD717aBDD847Ab11FE88'
const timelock = "0x00B60986B613B953d6DA14EA6eAd2f93861B61bD";

// describe('InvestmentDAO', function () {
//   async function initialSetUp() {
//     const [deployer, alvaro] = await ethers.getSigners()

//     const { gov, token, timelock } = await UtilsTest.deployDaoTest()

//     const usdc: IERC20 = await ethers.getContractAt("IERC20",usdcAddr)
//     const weth: IWETH9 = await ethers.getContractAt("IWETH9",wethAddr);

//     const userWithWeth = await ethers.getImpersonatedSigner("0xc6d973b31bb135caba83cf0574c0347bd763ecc5");
//     const userWithUsdc = await ethers.getImpersonatedSigner("0x4943b0c9959dcf58871a799dfb71bece0d97c9f4");
//     await usdc.connect(userWithUsdc).transfer(timelock.address, initialBalanceUsdc)
//     await weth.connect(userWithWeth).transfer(timelock.address, initialBalanceWeth)

//     const nonFungiblePositionManager: INonfungiblePositionManager = await ethers.getContractAt("INonfungiblePositionManager", nonFungiblePositionManagerAddr)

//     return {
//       gov,
//       token,
//       timelock,
//       nonFungiblePositionManager,
//       usdc,
//       weth,
//       deployer,
//       alvaro
//     }
//   }

//   describe('1.) Proposal to mint position in uniswap v3', function () {
//     async function mintPositionByProposal() {
//       const { gov, token, timelock, nonFungiblePositionManager,usdc,weth, deployer, alvaro } = await loadFixture(initialSetUp)

//       const tickLower = nearestUsableTick(TickMath.getTickAtSqrtRatio(encodeSqrtRatioX96(ethers.utils.parseUnits("1600","6").toString(),ethers.utils.parseEther("1").toString())), 10);
//       const tickUpper = nearestUsableTick(TickMath.getTickAtSqrtRatio(encodeSqrtRatioX96(ethers.utils.parseUnits("2100","6").toString(),ethers.utils.parseEther("1").toString())), 10);
      
//       const { callDatas, targets, values, descriptionHash } = await createProposal1(weth,ethers.utils.parseEther("0.00551"),usdc,ethers.utils.parseUnits("20","6"),nonFungiblePositionManager,tickLower,tickUpper,timelock)

//       await voteForAndExecutePropose(targets, values, callDatas, descriptionHash, deployer, gov, token);

//       const desc = ethers.utils.id(descriptionHash)

//       const tx = await (await gov.connect(deployer).execute(targets, values, callDatas, desc)).wait(1)
      
//       //Find log mint position
//       const eventNFPM = tx.events?.filter(event=>event.address == nonFungiblePositionManagerAddr)
//       const eventsDecode = eventNFPM?.map(event=>{
//         return nonFungiblePositionManager.interface.parseLog({ topics: event!.topics, data: event!.data })
//       })
//       const eventIncreaseLiquidity = eventsDecode?.find(event=>event!.name == 'IncreaseLiquidity')
//       const [tokenId,liquidity,amount0,amount1] = eventIncreaseLiquidity!.args
  
//       return {timelock,nonFungiblePositionManager,deployer,gov,token, usdc, weth, tokenId,liquidity,amount0,amount1}
//     }
    
//     it('Should minted position', async function () {
//        const {timelock, usdc, weth, tokenId,liquidity,amount0,amount1} = await loadFixture(mintPositionByProposal)

//        expect((await weth.balanceOf(timelock.address)).add(amount0)).to.eq(initialBalanceWeth)
//        expect((await usdc.balanceOf(timelock.address)).add(amount1)).to.eq(initialBalanceUsdc)
      
//     })

//     it('Should recovery position', async function () {
//       const {timelock,nonFungiblePositionManager,deployer,gov,token, usdc, weth, tokenId,liquidity } = await loadFixture(mintPositionByProposal)

//       const { callDatas, targets, values, descriptionHash } = await createProposal2(tokenId,liquidity,nonFungiblePositionManager,timelock)

//       await voteForAndExecutePropose(targets, values, callDatas, descriptionHash, deployer, gov, token);

//       const desc = ethers.utils.id(descriptionHash)

//       //console.log(await nonFungiblePositionManager.positions(tokenId))

//       const tx = await (await gov.connect(deployer).execute(targets, values, callDatas, desc)).wait(1)

//       //Find log mint position
//       const eventNFPM = tx.events?.filter(event=>event.address == nonFungiblePositionManagerAddr)
//       const eventsDecode = eventNFPM?.map(event=>{
//         return nonFungiblePositionManager.interface.parseLog({ topics: event!.topics, data: event!.data })
//       })
//       const eventDecreaseLiquidity = eventsDecode?.find(event=>event!.name == 'DecreaseLiquidity')
//       const [tokenIdD,liquidityD,amount0D,amount1D] = eventDecreaseLiquidity!.args

//       console.log(amount0D.toString())
//       console.log(amount1D.toString())

//       //console.log(await nonFungiblePositionManager.positions(tokenId))

     
//       console.log(ethers.utils.formatEther(await (await weth.balanceOf(timelock.address)).toString()))
//       console.log(ethers.utils.formatUnits(await (await usdc.balanceOf(timelock.address)).toString(),"6").toString())
     
//    })

//   })
// })

export default async function createProposalOpenPositionUniswap( amount0Min:string, amount1Min:string, fee:string, token0: ERC20, amount0: BigNumber, token1: ERC20, amount1: BigNumber, nonFungiblePositionManager: INonfungiblePositionManager, tickLower: number, tickUpper:number, title:string, description:string) {
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

// async function createProposal2(tokenId: string, liquidity: string, nonFungiblePositionManager: INonfungiblePositionManager,timelock: TimelockController) {
//   let callDatas = []
//   let targets = []
//   let values = []

//   const paramClose: INonfungiblePositionManager.DecreaseLiquidityParamsStruct = {
//     tokenId: tokenId,
//     liquidity: liquidity,
//     amount0Min: "0",
//     amount1Min: "0",
//     deadline: Math.floor(Date.now() + 10000)
//   }

//   console.log(paramClose)

//   callDatas.push(nonFungiblePositionManager.interface.encodeFunctionData('decreaseLiquidity', [paramClose]))
//   targets.push(nonFungiblePositionManager.address)
//   values.push('0')

//   const paramCollect: INonfungiblePositionManager.CollectParamsStruct = {
//     tokenId: tokenId,
//     recipient: timelock.address,
//     amount0Max: maxUint128,
//     amount1Max: maxUint128
//   }

//   console.log(paramCollect)

//   callDatas.push(nonFungiblePositionManager.interface.encodeFunctionData('collect', [paramCollect]))
//   targets.push(nonFungiblePositionManager.address)
//   values.push('0')

//   const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Collect and close position'))

//   return { callDatas, targets, values, descriptionHash }
// }


// async function voteForAndExecutePropose(targets: any[], values: any[], callDatas: any[], descriptionHash: string, proposer: SignerWithAddress, gov: Gov, token: GovToken) {

//   await (await token.connect(proposer).delegate(proposer.address)).wait(1)

//   const propose = await gov.connect(proposer).propose(targets, values, callDatas, descriptionHash)
//   const proposeReceipt = await propose.wait(1)
//   const proposalId = proposeReceipt.events![0].args!.proposalId.toString()

//   //Skip voting delay
//   await UtilsTest.skipBlock(process.env.INITIAL_VOTING_DELAY!)
//   await gov.connect(proposer).castVote(proposalId, 1)

//   //Skip voting period
//   await UtilsTest.skipBlock(process.env.INITIAL_VOTING_PERIOD!)

//   const desc = ethers.utils.id(descriptionHash)
//   await gov.connect(proposer).queue(targets, values, callDatas, desc)

//   //Skip delay timelock
//   await UtilsTest.skipBlock(process.env.MIN_DELAY_TIMELOCK!)

//   return { proposalId }

// }

