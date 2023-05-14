import { loadFixture, mine, mineUpTo } from '@nomicfoundation/hardhat-network-helpers'
import { ethers } from 'hardhat'
import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { UtilsTest } from './UtilsTest'
import { GovHelper__factory, GovHelper, IWETH, IERC20, ERC20, IPoolAddressesProvider, GovToken, GovFactory, Gov, TimelockController, AToken__factory } from "../typechain-types"
import { abi as VariableDebtTokenABI } from '@aave/core-v3/artifacts/contracts/protocol/tokenization/VariableDebtToken.sol/VariableDebtToken.json';
import { abi as AaveProtocolDataProviderABI } from '@aave/core-v3/artifacts/contracts/misc/AaveProtocolDataProvider.sol/AaveProtocolDataProvider.json'
import { DAOCreatedEventFilter, DAOCreatedEventObject } from '../typechain-types/artifacts/contracts/GovFactory';

const wethAddr = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1";
const usdcAddr = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const usdcInitial = ethers.utils.parseUnits("10000", "6").toString()
const wethBorrow = ethers.utils.parseEther("0.3")

//Chainlink
const oracleUsdcUsd = "0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3"

//Uniswap
const swapRouterAddr = "0xE592427A0AEce92De3Edee1F18E0157C05861564"

//Aave
const poolDataProviderAddr = "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654"
const debtAUsdcAddr = "0xFCCf3cAbbe80101232d343252614b6A3eE81C989"
const aUsdcAddr = "0x625E7708f30cA75bfd92586e17077590C60eb4cD"

const poolAaveAddr = "0x794a61358D6845594F94dc1DB02A252b5b4814aD"
const poolAddressProviderAddr = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb"


describe('InvestmentDAO', function () {
    async function initialSetUp() {
        const [deployer] = await ethers.getSigners()

        const { govFactory } = await UtilsTest.deployDaoFactory();

        const tx = await govFactory.deployDao(
            process.env.DAO_TOKEN_NAME!,
            process.env.DAO_TOKEN_SYMBOL!,
            process.env.MIN_DELAY_TIMELOCK!,
            process.env.DAO_NAME!,
            process.env.INITIAL_VOTING_DELAY!,
            process.env.INITIAL_VOTING_PERIOD!,
            process.env.QUORUM!,
            process.env.INITIAL_PROPOSAL_THRESHOLD!,
            process.env.DAO_TOKEN_AMOUNT_PREMINT!
        )

        const filter: DAOCreatedEventFilter = await govFactory.filters.DAOCreated(deployer.address)
        const logs: Array<any> = await govFactory.queryFilter(filter)
        const event: DAOCreatedEventObject = logs[0].args
        const { token: tokenAddr, helper: helperAddr, timelock: timelockAddr, gov: govAddr } = event
    
        const token: GovToken = await ethers.getContractAt('GovToken', tokenAddr)
        const gov: Gov = await ethers.getContractAt('Gov', govAddr)
        const timelock: TimelockController = await ethers.getContractAt('TimelockController', timelockAddr)
        const helper: GovHelper = await ethers.getContractAt('GovHelper', helperAddr)

        //Delegate votes
        await token.connect(deployer).delegate(deployer.address)

        //Capitalize timelock treasury with impersonationSigner
        const usdc: ERC20 = await ethers.getContractAt("ERC20", usdcAddr)
        const userWithUsdc = await ethers.getImpersonatedSigner("0x4943b0c9959dcf58871a799dfb71bece0d97c9f4");
        const weth = await ethers.getContractAt("IWETH9", wethAddr);
        const userWithWeth = await ethers.getImpersonatedSigner("0xc6d973b31bb135caba83cf0574c0347bd763ecc5");
        await usdc.connect(userWithUsdc).transfer(timelock.address, usdcInitial)
        
        const poolDataProvider = await ethers.getContractAt(AaveProtocolDataProviderABI, poolDataProviderAddr)
    
        //await weth.connect(userWithWeth).transfer(deployer.address, wethCollateral)

        /*const govHelperFactory: GovHelper__factory = await ethers.getContractFactory("GovHelper")
        const govHelper: GovHelper = await govHelperFactory.deploy(poolAddressProviderAddr, swapRouterAddr, oracleUsdcUsd)
        await govHelper.deployed()*/

        return {
            deployer,
            helper,
            timelock,
            token,
            gov,
            usdc,
            weth,
            poolDataProvider
        }
    }

    describe('1.) Aave', function () {
        it('Should execute natural short', async function () {
            const {  deployer, helper, timelock, token, gov, usdc, weth, poolDataProvider } = await loadFixture(initialSetUp)

            const aaveAdrrProvider: IPoolAddressesProvider = await ethers.getContractAt("IPoolAddressesProvider", "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb")
            const aavePoolAddr: string = await aaveAdrrProvider.getPool()
            const pool = await ethers.getContractAt("IPool", aavePoolAddr)
            const wethData = await pool.getReserveData(wethAddr)
            const variableDebtToken = await ethers.getContractAt(VariableDebtTokenABI, wethData.variableDebtTokenAddress)
            
            const amountIn = ethers.utils.parseUnits("1000", "6")

            const oraculoUsdcWeth = "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612"
            const { callDatas, targets, values, descriptionHash } = await createProposeOpenNaturalPosition(helper, usdc, amountIn.toString(), weth, wethBorrow.toString(),"2", oraculoUsdcWeth,"50","500",variableDebtToken)

            const propose = await gov.connect(deployer).propose(targets, values, callDatas, descriptionHash)

            const proposeReceipt = await propose.wait(1)
            const proposalId = proposeReceipt.events![0].args!.proposalId.toString()

            //Skip voting delay
            await UtilsTest.skipBlock(process.env.INITIAL_VOTING_DELAY!)
            await gov.connect(deployer).castVote(proposalId, 1)
            //Skip voting period
            await UtilsTest.skipBlock(process.env.INITIAL_VOTING_PERIOD!)

            //As we have set up time lock we can not execute the proposal directly
            const desc = ethers.utils.id(descriptionHash)
            await gov.queue(targets, values, callDatas, desc)

            //Skip delay timelock
            await UtilsTest.skipBlock(process.env.MIN_DELAY_TIMELOCK!)

            const balanceBefore = await usdc.balanceOf(timelock.address)
            console.log(`USDC Before ${ethers.utils.formatUnits(balanceBefore, "6")}`)

            await (await gov.connect(deployer).execute(targets, values, callDatas, desc)).wait(1)

            /*await variableDebtToken.connect(deployer).approveDelegation(govHelper.address, wethBorrow)
            usdc.connect(deployer).approve(govHelper.address, amountIn)

            await govHelper.borrowSwap(usdcAddr, amountIn, wethAddr, wethBorrow, 2, "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612", 50, 500)**/

            const balanceAfter = await usdc.balanceOf(deployer.address)
            console.log(`USDC After ${ethers.utils.formatUnits(balanceAfter, "6")}`)

            const balanceDebt = await variableDebtToken.connect(deployer).balanceOf(timelock.address);

            console.log(`Balance debt: ${balanceDebt}`)

            ethers.provider.send("evm_increaseTime", [24 * 3600]);
            ethers.provider.send("evm_mine", []);

            const balanceDebtAfterDay = await variableDebtToken.connect(deployer).balanceOf(timelock.address);

            console.log(`BalanceDebtAfterDay ${balanceDebtAfterDay}`)

            //////////////Propose repay

            /*usdc.connect(deployer).approve(govHelper.address, amountIn)
            await govHelper.swapRepay(usdcAddr, amountIn, wethAddr, 100, 500, "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612", 2)*/

            const usdcData = await pool.getReserveData(usdcAddr)
            const aUsdc = await ethers.getContractAt("IERC20", usdcData.aTokenAddress)
            const balanceAUsdc = await aUsdc.connect(deployer).balanceOf(timelock.address)

            const { callDatas: callDatasClose, targets: targetsClose, values: valueClose, descriptionHash: descriptionHashClose } = await createProposeCloseNaturalPosition(usdc,helper,weth,amountIn.toString(),"0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612","100","500","2", balanceAUsdc.toString(), pool, timelock.address)

            const proposeClose = await gov.connect(deployer).propose(targetsClose, valueClose, callDatasClose, descriptionHashClose)

            const proposeReceiptClose = await proposeClose.wait(1)
            const proposalIdClose = proposeReceiptClose.events![0].args!.proposalId.toString()
            
            //Skip voting delay
            await UtilsTest.skipBlock(process.env.INITIAL_VOTING_DELAY!)
            await gov.connect(deployer).castVote(proposalIdClose, 1)
            //Skip voting period
            await UtilsTest.skipBlock(process.env.INITIAL_VOTING_PERIOD!)

            //As we have set up time lock we can not execute the proposal directly
            const descClose = ethers.utils.id(descriptionHashClose)
            await gov.queue(targetsClose, valueClose, callDatasClose, descClose)

            //Skip delay timelock
            await UtilsTest.skipBlock(process.env.MIN_DELAY_TIMELOCK!)

            const balanceBeforeClose = await usdc.balanceOf(timelock.address)
            console.log(`USDC Before ${ethers.utils.formatUnits(balanceBeforeClose, "6")}`)

            await (await gov.connect(deployer).execute(targetsClose, valueClose, callDatasClose, descClose )).wait(1)

            const balanceAfterClose = await usdc.balanceOf(timelock.address)
            console.log(`USDC After ${ethers.utils.formatUnits(balanceAfterClose, "6")}`)

            const balanceAfterHelperUsdc = await usdc.balanceOf(helper.address)
            console.log(`USDC After Helper ${ethers.utils.formatUnits(balanceAfterHelperUsdc, "6")}`)

            const balanceAfterHelperWeth = await weth.balanceOf(helper.address)
            console.log(`Weht After ${ethers.utils.formatUnits(balanceAfterHelperUsdc, "18")}`)

            //with
            /*const usdcData = await pool.getReserveData(usdcAddr)
            const aUsdc = await ethers.getContractAt("IERC20", usdcData.aTokenAddress)
            const balanceAUsdc = await aUsdc.connect(deployer).balanceOf(deployer.address)
            console.log(balanceAUsdc)*/

            /*const usdcBalanceBeforeWithdraw = await usdc.connect(deployer).balanceOf(deployer.address)
            console.log(usdcBalanceBeforeWithdraw)
            await pool.withdraw(usdcAddr, balanceAUsdc, deployer.address)
            const usdcBalanceAfterWithdraw = await usdc.connect(deployer).balanceOf(deployer.address)
            console.log(usdcBalanceAfterWithdraw)*/


            //console.log(BigNumber.from("574237012914548743819289237524766").shr(128))
            //console.log()

        })
    })
})

async function createProposeCloseNaturalPosition(tokenIn:ERC20, helper: GovHelper, borrowToken: IWETH, borrowAmount: string, priceFeed: string, slippage:string, poolFee:string, interestRateMode: string,balanceAUsdc:string, pool:any, timelockAddr:string){

 
    let callDatas = []
    let targets = []
    let values = []

    callDatas.push(tokenIn.interface.encodeFunctionData('approve', [helper.address, borrowAmount]))
    targets.push(tokenIn.address)
    values.push('0')

    callDatas.push(helper.interface.encodeFunctionData('swapRepay', [tokenIn.address, borrowAmount, borrowToken.address,slippage,poolFee,priceFeed,interestRateMode]))
    targets.push(helper.address)
    values.push('0')

    console.log(balanceAUsdc)

    callDatas.push(pool.interface.encodeFunctionData('withdraw',[tokenIn.address,balanceAUsdc,timelockAddr]))
    targets.push(pool.address)
    values.push('0')

    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Open natural position'))

    return { callDatas, targets, values, descriptionHash }

}


async function createProposeOpenNaturalPosition(
    helper: GovHelper,
    collateralToken: ERC20,
    collateralAmount: string,
    borrowToken: IWETH,
    borrowAmount: string,
    interestRateMode: string,
    priceFeed: string,
    slippage: string,
    poolFee: string,
    variableDebtToken: any
  ) {

    
    let callDatas = []
    let targets = []
    let values = []

    //Approve delegation
    callDatas.push(variableDebtToken.interface.encodeFunctionData('approveDelegation', [helper.address,borrowAmount]))
    targets.push(variableDebtToken.address)
    values.push('0')

    //Approve USDC
    callDatas.push(collateralToken.interface.encodeFunctionData('approve', [helper.address, collateralAmount]))
    targets.push(collateralToken.address)
    values.push('0')
   
    //BorrowSwap
    const params: any = [collateralToken.address,collateralAmount,borrowToken.address,borrowAmount,interestRateMode,priceFeed,slippage,poolFee]
    callDatas.push(helper.interface.encodeFunctionData('borrowSwap', [...params]).toString())
    targets.push(helper.address)
    values.push('0')

    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Open natural position'))
  
    return { callDatas, targets, values, descriptionHash }
  }
















