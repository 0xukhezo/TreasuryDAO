import { loadFixture, mine, mineUpTo } from '@nomicfoundation/hardhat-network-helpers'
import { ethers } from 'hardhat'
import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { UtilsTest } from './UtilsTest'
import { GovHelper__factory, GovHelper, IERC20, IWETH9, IPoolAddressesProvider, AaveProtocolDataProvider } from "../typechain-types"
import { abi as VariableDebtTokenABI } from '@aave/core-v3/artifacts/contracts/protocol/tokenization/VariableDebtToken.sol/VariableDebtToken.json';
import { abi as AaveProtocolDataProviderABI } from '@aave/core-v3/artifacts/contracts/misc/AaveProtocolDataProvider.sol/AaveProtocolDataProvider.json'
import JSBI from 'jsbi'



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
        const [deployer, alvaro] = await ethers.getSigners()

        const poolDataProvider = await ethers.getContractAt(AaveProtocolDataProviderABI, poolDataProviderAddr)
        const usdc: IERC20 = await ethers.getContractAt("IERC20", usdcAddr)
        const userWithUsdc = await ethers.getImpersonatedSigner("0x4943b0c9959dcf58871a799dfb71bece0d97c9f4");

        const weth = await ethers.getContractAt("IWETH9", wethAddr);
        const userWithWeth = await ethers.getImpersonatedSigner("0xc6d973b31bb135caba83cf0574c0347bd763ecc5");

        await usdc.connect(userWithUsdc).transfer(deployer.address, usdcInitial)
        //await weth.connect(userWithWeth).transfer(deployer.address, wethCollateral)

        const govHelperFactory: GovHelper__factory = await ethers.getContractFactory("GovHelper")
        const govHelper: GovHelper = await govHelperFactory.deploy(poolAddressProviderAddr, swapRouterAddr, oracleUsdcUsd)
        await govHelper.deployed()

        return {
            deployer,
            govHelper,
            usdc,
            weth,
            poolDataProvider
        }
    }

    describe('1.) Aave', function () {
        it('Should execute natural short', async function () {
            const { govHelper, usdc, weth, deployer, poolDataProvider } = await loadFixture(initialSetUp)

            const aaveAdrrProvider: IPoolAddressesProvider = await ethers.getContractAt("IPoolAddressesProvider", "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb")
            const aavePoolAddr: string = await aaveAdrrProvider.getPool()
            const pool = await ethers.getContractAt("IPool", aavePoolAddr)
            const wethData = await pool.getReserveData(wethAddr)

            const variableDebtToken = await ethers.getContractAt(VariableDebtTokenABI, wethData.variableDebtTokenAddress)
            await variableDebtToken.connect(deployer).approveDelegation(govHelper.address, wethBorrow)

            const amountIn = ethers.utils.parseUnits("1000", "6")
            usdc.connect(deployer).approve(govHelper.address, amountIn)

            const balanceBefore = await usdc.balanceOf(deployer.address)
            console.log(`USDC Before ${ethers.utils.formatUnits(balanceBefore, "6")}`)

            await govHelper.borrowSwap(usdcAddr, amountIn, wethAddr, wethBorrow, 2, "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612", 50, 500)

            const balanceAfter = await usdc.balanceOf(deployer.address)
            console.log(`USDC After ${ethers.utils.formatUnits(balanceAfter, "6")}`)

            const balanceDebt = await variableDebtToken.connect(deployer).balanceOf(deployer.address);

            //console.log(balanceDebt)

            ethers.provider.send("evm_increaseTime", [24 * 3600]);
            ethers.provider.send("evm_mine", []);

            //const balanceDebtAfterDay = await variableDebtToken.connect(deployer).balanceOf(deployer.address);

            //console.log(balanceDebtAfterDay)

            usdc.connect(deployer).approve(govHelper.address, amountIn)
            await govHelper.swapRepay(usdcAddr, amountIn, wethAddr, 500, 500, "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612", 2)

            //with
            const usdcData = await pool.getReserveData(usdcAddr)
            const aUsdc = await ethers.getContractAt("IERC20", usdcData.aTokenAddress)
            const balanceAUsdc = await aUsdc.connect(deployer).balanceOf(deployer.address)
            console.log(balanceAUsdc)

            const usdcBalanceBeforeWithdraw = await usdc.connect(deployer).balanceOf(deployer.address)
            console.log(usdcBalanceBeforeWithdraw)
            await pool.withdraw(usdcAddr, balanceAUsdc, deployer.address)
            const usdcBalanceAfterWithdraw = await usdc.connect(deployer).balanceOf(deployer.address)
            console.log(usdcBalanceAfterWithdraw)


            //console.log(BigNumber.from("574237012914548743819289237524766").shr(128))
            //console.log()


        })
    })
})
















